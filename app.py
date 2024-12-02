from flask import Flask, render_template, request, jsonify
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler
import psycopg2  # PostgreSQL 연결 라이브러리
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__, static_folder='static')

# PostgreSQL 연결 설정
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode='require', cursor_factory=RealDictCursor)

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

        # 예측 결과를 PostgreSQL에 저장
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO predictions (personality, preference, budget, appliances, style)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (personality, preference, budget, appliances, prediction[0])
        )
        connection.commit()
        cursor.close()
        connection.close()

        # 예측 결과 반환
        return jsonify({'style': prediction[0]})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)})

@app.route('/get_last_prediction', methods=['GET'])
def get_last_prediction():
    try:
        # PostgreSQL에서 마지막 예측 결과를 가져옴
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM predictions ORDER BY id DESC LIMIT 1")
        last_prediction = cursor.fetchone()
        cursor.close()
        connection.close()

        if last_prediction:
            return jsonify({'last_prediction': last_prediction})
        else:
            return jsonify({'last_prediction': '없음'})

    except Exception as e:
        print(f"Error occurred while fetching last prediction: {e}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
