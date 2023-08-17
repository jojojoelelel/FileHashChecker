from flask import Flask, request, jsonify
import subprocess, os

#APP
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

def generate_md5_hash(file_path):
    try:
        md5_hash = subprocess.check_output(['bash', 'generate_md5.sh', file_path])
        return md5_hash.decode().strip()
        
    except subprocess.CalledProcessError as e:
        print(f"Error while generating MD5 hash: {e}")
        return None
    
def check_md5_checksums_equal(md5_checksums):

    return all(md5_checksum == md5_checksums[0] for md5_checksum in md5_checksums)

if __name__ == "__main__":
    app.run(debug=True)