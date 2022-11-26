import pandas as pd
import mysql.connector
df = pd.read_csv("C:\\Users\\anish\\Downloads\\United_States_COVID-19_Cases_and_Deaths_by_State_over_Time_-_ARCHIVED.csv")
df1 = df[['state','tot_cases', 'tot_death','new_case','new_death']]

insertScript = ("INSERT INTO app_covid19.records_covid19 "
               "(state, tot_cases, tot_death, new_case, new_death) "
               "VALUES (%s, %s, %s, %s, %s)")
database_connection = mysql.connector.connect(user='root', password='12345',
                                             host='localhost',
                                             database='app_covid19')
cursor = database_connection.cursor()
df1 = df1.reset_index() 

for index, row in df1.iterrows():
        insertData = (row['state'],int(row['tot_cases']), (int(row['tot_death'])),(int(row['new_case'])), (int(row['new_death'])))
        cursor.execute(insertScript, insertData)
        database_connection.commit() 
cursor.close()
