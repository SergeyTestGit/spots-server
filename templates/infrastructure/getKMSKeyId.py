import sys
import json


def getKMSKeyId(searchName, exportsStr):
    exportArray = json.loads(exportsStr)['Exports']

    for item in exportArray:
        if item['Name'] == searchName:
            print(item['Value'][-36:])
            break
