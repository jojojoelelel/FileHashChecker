
FROM python:3.9

WORKDIR /app/backend

COPY . .

RUN pip install -r requirements.txt

EXPOSE 3000

CMD ["python3", "pytest.py"]
