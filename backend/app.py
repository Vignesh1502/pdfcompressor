from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import gzip
import shutil

app = FastAPI()

# CORS configuration
origins = [
    "http://127.0.0.1:3000",  # Your React frontend URL
    "http://localhost:3000"   # Include this if you might use 'localhost'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Allows requests from these origins
    allow_credentials=True,          # Allows cookies to be sent in requests
    allow_methods=["*"],             # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],             # Allows all headers
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as temp_file:
        shutil.copyfileobj(file.file, temp_file)

    original_size = os.path.getsize(temp_file_path)
    
    # Compress the file using gzip
    compressed_file_path = f"compressed_{file.filename}.gz"
    try:
        with open(temp_file_path, 'rb') as f_in:
            with gzip.open(compressed_file_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)

        # Check if the file was created successfully
        if os.path.exists(compressed_file_path):
            compressed_size = os.path.getsize(compressed_file_path)
        else:
            return {"error": "File compression failed."}
    except Exception as e:
        return {"error": str(e)}
    
    # Clean up the temporary file
    os.remove(temp_file_path)
    
    # Return the compressed file along with size details
    return {
        "original_size": original_size,
        "compressed_size": compressed_size,
        "filename": compressed_file_path
    }

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(os.getcwd(), filename)
    if os.path.exists(file_path):
        return StreamingResponse(open(file_path, 'rb'), media_type='application/gzip', headers={"Content-Disposition": f"attachment; filename={filename}"})
    else:
        return {"error": "File not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
