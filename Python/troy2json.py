import re
import json

RE_EMITTER = re.compile(r"^\[\w+\][\s\w\-=\.\"]+$", re.MULTILINE)
RE_EMITTER_NAME = re.compile(r"^\[(\w+)\]$", re.MULTILINE)
RE_PROPERTY_VALUE = re.compile(r"(^[\w-]+)=([-\w\.\s\"]+)$", re.MULTILINE)

def troy2json(infile, outfile):
    emitters = RE_EMITTER.findall(infile.read())

    troy_dict = {}

    for emitter in emitters:
        name = RE_EMITTER_NAME.findall(emitter)
        props = RE_PROPERTY_VALUE.findall(emitter)

        troy_dict[name[0]] = {}

        for prop, val in props:
            troy_dict[name[0]][prop] = val.strip().replace('"', "")

    json.dump(troy_dict, outfile, indent=2)
            
    infile.close()
    outfile.close()
    
    print("Successful conversion!")
