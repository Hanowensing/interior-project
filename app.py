from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler
import os

app = Flask(__name__, static_folder='static')

# Supabase 연결 설정
SUPABASE_URL = os.getenv("SUPABASE_URL")  # 환경 변수에서 Supabase URL을 가져옵니다.
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # 환경 변수에서 Supabase 키를 가져옵니다.

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 샘플 데이터 (질문에 대한 답변과 인테리어 스타일)
data = [
    [1, 1, 30, 4],  # 내향적/차분 / 예산 30 / 가전 4개
    [1, 0, 20, 3],  # 내향적/내부 독특 / 예산 20 / 가전 3개
    [0, 1, 50, 6],  # 외향적/차분 / 예산 50 / 가전 6개
    [0, 0, 40, 5],  # 외향적/내부 독특 / 예산 40 / 가전 5개
]

# 각 데이터에 대한 레이블 (추천되는 인테리어 스타일)
labels = ["유재석 스타일", "기안 84 스타일", "박나래 스타일", "노홍철 스타일"]

# KNN 모델 초기화
knn = KNeighborsClassifier(n_neighbors=1)

# 예산과 가전 개수를 0~1 범위로 스케일링
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform([d[2:] for d in data])  # 예산과 가전만 스케일링

# 데이터를 KNN 모델에 맞게 합침
knn_data = [d[:2] + list(scaled) for d, scaled in zip(data, scaled_data)]  # personality, preference, scaled budget and appliances

# KNN 모델 학습
knn.fit(knn_data, labels)

# 문자열을 숫자로 매핑
personality_map = {"내향적": 1, "외향적": 0}
preference_map = {"차분한 분위기": 1, "내부 독특": 0}

@app.route('/')
def index():
    return render_template('test.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 클라이언트에서 JSON 데이터를 받는다.
        data = request.get_json()
        print(f"Received data: {data}")  # 클라이언트로부터 받은 데이터 확인

        if not data:
            return jsonify({'error': 'No data received'})

        # personality와 preference를 숫자로 변환
        personality = personality_map.get(data['personality'])
        preference = preference_map.get(data['preference'])

        if personality is None or preference is None:
            return jsonify({'error': 'Invalid personality or preference'})

        # 예산과 가전 개수는 숫자로 변환
        try:
            budget = int(data['budget'])
            appliances = int(data['appliances'])
        except ValueError:
            return jsonify({'error': 'Invalid number for budget or appliances'})

        print(f"Processed data for prediction: {personality}, {preference}, {budget}, {appliances}")

        # 예산과 가전 개수에 대한 스케일링을 적용
        scaled_values = scaler.transform([[budget, appliances]])  # 예산과 가전 개수만 스케일링
        scaled_budget, scaled_appliances = scaled_values[0]  # 스케일링된 예산과 가전 개수

        # 예측할 데이터를 배열로 결합 (4개의 특성)
        answers = [personality, preference] + list(scaled_values[0])  # 4개 특성
        print(f"Predicting with: {answers}")

        # KNN 모델로 예측
        prediction = knn.predict([answers])
        print(f"Prediction result: {prediction[0]}")  # 예측된 스타일 출력

        # 예측 결과를 Supabase에 저장
        response = supabase.table("predictions").insert({
            "personality": personality,
            "preference": preference,
            "budget": budget,
            "appliances": appliances,
            "style": prediction[0]
        }).execute()

        if response.get("status_code") == 201:
            print("Prediction saved to Supabase.")
        else:
            print("Error saving prediction:", response)

        # 예측 결과 반환
        return jsonify({'style': prediction[0]})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)})

@app.route('/get_last_prediction', methods=['GET'])
def get_last_prediction():
    try:
        # Supabase에서 마지막 예측 결과를 가져옴
        response = supabase.table("predictions").select("*").order("id", desc=True).limit(1).execute()
        last_prediction = response.get("data")

        if last_prediction:
            return jsonify({'last_prediction': last_prediction[0]})
        else:
            return jsonify({'last_prediction': '없음'})

    except Exception as e:
        print(f"Error occurred while fetching last prediction: {e}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
