from flask import Flask, request, jsonify
import os
from md5_utils import generate_md5_hash

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        md5_checksums = []
        
        for file_key in request.files:
            uploaded_file = request.files[file_key]
            #print("current file path ==>" + os.getcwd())
            uploaded_file.save(os.getcwd() + '/' + uploaded_file.filename) 
            md5_checksum = generate_md5_hash(uploaded_file.filename)
            #print("uploaded_file.filename ==> " + uploaded_file.filename)
            md5_checksums.append(md5_checksum)
    
        #checksums_equal = check_md5_checksums_equal(md5_checksums)
        
        #print(checksums_equal)
        return jsonify(md5_checksums)
    
    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(debug=True)