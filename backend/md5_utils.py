import subprocess

def generate_md5_hash(file_path):
    try:
        md5_hash = subprocess.check_output(['bash', 'generate_md5.sh', file_path])
        return md5_hash.decode().strip()

    except subprocess.CalledProcessError as e:
        print(f"Error while generating MD5 hash: {e}")
        return None
