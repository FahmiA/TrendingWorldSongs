import sys

import xml.etree.ElementTree as ET
import re

def appendStyleElement(svgRoot):
    print 'Appending CSS style'

    svgRoot.set('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')

    defsElement = ET.Element('defs')

    linkElement = ET.Element('xhtml:link', {
        'href': 'style.css',
        'type': 'text/css',
        'rel': 'stylesheet'
    })

    svgRoot.insert(0, defsElement)
    defsElement.append(linkElement)

def resolveScribbleIDs(svgRoot):
    print 'Resolving scribble country IDs'
    resolveIds(svgRoot, 'scribbles', 'Scribble')

def resolveCountryIDs(svgRoot):
    print 'Resolving country IDs'
    resolveIds(svgRoot, 'Countries', 'Country')

def resolveIds(svgRoot, groupID, idPrefix):
    groupElement = None
    for childElement in svgRoot:
        if(childElement.tag == '{http://www.w3.org/2000/svg}g' and childElement.get('id') == groupID):
            groupElement = childElement
            break

    if groupElement == None:
        print 'WARN: Could not find "%s" group' % (groupID)
        return

    for childElement in groupElement:
        elementID = childElement.get('id')
        if elementID == None:
            continue

        elementID = re.sub(r'_\d+_$', '', elementID) # Remove _1_, _2_, and the likes
        elementID = idPrefix + '-' + elementID
        childElement.set('id', elementID)

def updateViewbox(svgRoot):
    print 'Correcting SVG ViewBox'

    svgRoot.set('viewBox', '250 200 200 400')

if __name__ == '__main__':
    inputPath = sys.argv[1]
    outputPath = 'out.svg'

    doc = ET.parse(inputPath)
    svgRoot = doc.getroot();

    appendStyleElement(svgRoot)
    resolveScribbleIDs(svgRoot)
    resolveCountryIDs(svgRoot)
    updateViewbox(svgRoot)

    print 'Writing file to', outputPath

    ET.register_namespace('','http://www.w3.org/2000/svg')
    doc.write(outputPath,
             xml_declaration = True,
             encoding = 'utf-8',
             method = 'xml')

    print 'Done'

