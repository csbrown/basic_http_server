from flask import Flask, request, jsonify
import os
import random
app = Flask(__name__)

with open("key", "r") as f:
    qi = f.read()

LETTERS = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
def isonlyletters(string):
    stringchars = set(string)
    stringletters = stringchars & LETTERS
    return len(stringletters) == len(stringchars)
    

@app.route('/images/<gallery>', methods=['GET', 'POST'])
def get_img_list(gallery):
    if isonlyletters(gallery): # PREVENT INJECTION ATTACKS
        root = "images/" + gallery
        if not os.path.isdir(root):
            return "[]"
        if request.method == "POST":
            return img_upload(root) 
        return jsonify(list(map(lambda x: root + "/" + x, os.listdir(root))))
    return "[]"

def img_upload(gallery):
    # check if the post request has the file part
    k = request.get_json()["key"]
    if k != qi:
        return "[]"
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    img = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if img.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if img and allowed_file(img.filename):
        filename = secure_filename(img.filename)
        img.save(os.path.join(gallery, filename))
