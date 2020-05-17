import pandas as pd 
import json

# Sample data randomly
def randomSample(df, frac=0.01):
    return df.sample(frac=frac).reset_index(drop=True)

# Sample data stratifiedly
def stratifiedSample(df, frac = 0.01):
    df = df.groupby('License Type').apply(lambda x: x.sample(frac=frac))
    return df.reset_index(drop=True)

# Load data from url and process it
def read(url):
    df = pd.read_csv(url)
    # Drop unused collums
    df = df.drop(columns = ['Business Name 2', 'Address Building', 'Address Street Name', 
                            'Secondary Address Street Name', 'Contact Phone Number', 'Borough Code',
                            'Community Board', 'Council District', 'BIN', 'BBL', 'NTA', 'Census Tract',
                            'Detail', 'Longitude', 'Latitude', 'Location', 'Address City'])

    # Industry type merge dictionary
    industry_type = {'Amusement': ['Amusement Arcade', 'Amusement Device Permanent', 'Amusement Device Portable', 'Amusement Device Temporary'],
                     'Garage and Parking Lot': ['Garage and Parking Lot', 'Garage', 'Parking Lot'],
                     'Laundry': ['Laundry', 'Laundries', 'Laundry Jobber'],
                     'Locksmith': ['Locksmith', 'Locksmith Apprentice'],
                     'Secondhand Dealer': ['Secondhand Dealer - Auto', 'Secondhand Dealer - Firearms', 'Secondhand Dealer - General'],
                     'Tow Truck': ['Tow Truck Company', 'Tow Truck Exemption']}
    # Filter by zipcode in NYC
    f = open('nycbyzipcode.json')
    zip = json.load(f)
    zipcode = []
    for fea in zip['features']:
        zipcode.append(fea['properties']['postalCode'])
    f.close()
    df = df[df['Address ZIP'].isin(set(zipcode))]

    # Merge industry type
    replace = {}
    for key, value in industry_type.items():
        for v in value:
            replace[v] = key
    df['Industry'] = df['Industry'].replace(replace)

    # Sample
    df = stratifiedSample(df)

    # Set borough code for individual
    df.loc[df['License Type'] == 'Individual', 'Address Borough'] = 'null'

    # Drop missing values
    df = df.dropna(axis='index', how='any')

    # Rename column names

    # Convert to datetime
    df['License Expiration Date'] = pd.to_datetime(df['License Expiration Date'], format='%m/%d/%Y', errors='coerce')
    df['License Creation Date'] = pd.to_datetime(df['License Creation Date'], format='%m/%d/%Y', errors='coerce')

    industry = df['Industry'].unique()
    for type in industry:
        if len(df.loc[df['Industry'] == type].index) < 3:
            df.loc[df['Industry'] == type, 'Industry'] = None
    df = df.dropna(axis='index', how='any')

    # Column rename
    name = {'DCA License Number': 'DCA_License_Number', 'License Type': 'License_Type', 
            'License Expiration Date': 'License_Expiration_Date', 'License Status': 'License_Status',
            'License Creation Date': 'License_Creation_Date', 'Business Name': 'Business_Name',
            'Address State': 'Address_State', 'Address ZIP': 'Address_ZIP', 'Address Borough': 'Address_Borough'}
    df = df.rename(columns = name)

    return df.reset_index(drop=True)

if __name__ == '__main__':
    url = 'https://raw.githubusercontent.com/michaelofsbu/cse564_finaldata/master/Legally_Operating_Businesses.csv'
    df = read(url)
    df.to_csv(r'./processed_data.csv', index=False)
    
