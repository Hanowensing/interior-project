from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template('survey.html')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # 클라이언트에서 JSON 데이터를 받는다.
        data = request.get_json()
        print(f"Received data: {data}")  # 클라이언트로부터 받은 데이터 확인

        if not data:
            return jsonify({'error': 'No data received'})

        # responses.json 파일 경로
        responses_file_path = os.path.join('server', 'responses.json')

        # 파일이 존재하면 기존 데이터를 불러옴, 없으면 새로 생성
        if os.path.exists(responses_file_path):
            with open(responses_file_path, 'r', encoding='utf-8') as file:
                responses = json.load(file)
        else:
            responses = []

        # 새로운 응답 데이터를 추가
        responses.append(data)

        # 수정된 데이터를 다시 responses.json 파일에 저장
        with open(responses_file_path, 'w', encoding='utf-8') as file:
            json.dump(responses, file, ensure_ascii=False, indent=4)

        print("Survey response saved to responses.json.")

        return jsonify({'message': 'Survey data submitted successfully'})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
