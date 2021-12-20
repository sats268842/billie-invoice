# import os
# from typing import List

# # import aiofiles
# from fastapi import UploadFile
# from datetime import datetime
# import shutil

# # from app.model.emails import EmailRequest
# # from app.utils.mail_utils import send_mail
# def get_datetime():
#     # return a current datetime string
#     return datetime.now().strftime("%Y%m%d_%H%M%S")


# async def save_uploaded_files_to_wkdir(files):
#     # Create temporary folder for storing uploaded files
#     file_path = f"app/data/temp/upload_{get_datetime()}"
#     os.mkdir(file_path)

#     # save the file in local directory and get the list of files
#     list_files = []
#     for file in files:
#         _file_name = os.path.join(file_path, file.filename)
#         print("File Name: ", _file_name)
#         async with aiofiles.open(_file_name, "wb") as out_file:
#             content = await file.read()  # async read
#             await out_file.write(content)  # async write
#         list_files.append(_file_name)

#     return {
#         "path_to_folder": file_path,
#         "list_files": list_files,
#     }
