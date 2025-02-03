# data_vis

# How to extract data from copernicus servers
The script that will be used is ```copernicus_data_export.py``` located in the ```scripts``` folder. This script will download data from the copernicus servers and save it in the ```data``` folder.

You must follow the following steps to download the data:
## 1 - Prepare your python environment
Ensure that you have the necessary python packages installed. From the root of the project, create and activate your virtual environment and run the following command:
   
**create a virtual environment and activate it**
```bash
python -m venv .venv
.venv\Scripts\activate
```
Once you virtual environment is activated, you can install the necessary packages.

**install the necessary packages**
```bash
pip install -r requirements.txt
```
## 2 - Run the script
The script ```copernicus_data_export.py``` will download data from copernicus servers from the links in ```scripts/copernicus_manifest.txt```. First, modify the ```number_of_files``` variable to the number of files you want to download. Then, run the scipt :
```bash
python scripts/copernicus_data_export.py
```
The data will be saved in the ```data``` folder.

# Build and deploy
To run build and deploy the app, you must execute the following commands in the ```frontend``` folder:
**install all dependencies**
```bash
npm install
```
**build the app**
```bash
npm run build
```
**deploy locally to dev**
```bash
npm start
 
```

**deploy the app via github pages**
```bash
npm run deploy
```

The can now be accessed at the following adress : https://anto-nain.github.io/data-vis/