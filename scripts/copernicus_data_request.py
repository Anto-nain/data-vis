import requests
import pandas as pd


number_of_files = 100
counter = 0


manifest = "scripts/copernicus_manifest.txt"
metadata = []
data = []

for line in open(manifest):
    line = line.strip()
    if line and counter < number_of_files:
        response = requests.get(line)
        if response.status_code == 200:
            try:
                # get metadata
                point_id = counter
                geometry = response.json()["geometry"]["coordinates"]
                basin = response.json()["properties"]["basin"]
                river = response.json()["properties"]["river"]
                country = response.json()["properties"]["country"]
                
                # save metadata
                meta = {}
                meta["point_id"] = point_id
                meta["geometry0"] = geometry[0]
                meta["geometry1"] = geometry[1]
                meta["basin"] = basin
                meta["river"] = river
                meta["country"] = country
                meta["link"] = line
                metadata.append(meta)
                
                # get data
                water_data = response.json()["data"]
                heights = []
                datetimes = []
                for entry in water_data:
                    heights.append(entry["orthometric_height_of_water_surface_at_reference_position"])
                    datetimes.append(entry["datetime"])
            
                
                # save data to csv
                df = pd.DataFrame({
                    "datetime": datetimes,
                    "height": heights,
                    "point_id": point_id
                })
                data.append(df)
                            
            except Exception as e:
                print(f"Failed to retrieve data from {line}, reason: {e}")
            
            finally:
                counter += 1
                print(f"number of files treated: {counter}/{number_of_files}", end='\r', flush=True)
        else:
            print(f"Failed to retrieve data from {line}")

#save metadata to csv
metadata_df = pd.DataFrame(metadata)
metadata_df.to_csv("frontend/src/data/metadata.csv", index=False, sep=',')

#save data to csv
data_df = pd.concat(data)
data_df.to_csv("frontend/src/data/data.csv", index=False, sep=',')
