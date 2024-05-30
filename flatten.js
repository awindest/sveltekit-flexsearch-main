import * as fs from 'fs';

function flattenKeys (data) {
    let newData = {}
    let list = []
    Object.keys(data).forEach(key => {
        console.log(key)
        if (Array.isArray(data[key])) {
            data[key].forEach((value, index) => {
            newData[key+ (index+1)] = value
            list.push(newData)
            })
        } else {
            newData[key] = data[key]
            list.push(newData)

        }
    })
    console.log(list)
    return newData
}
let input = {
    "data": {
        "id": "Talend Studio 8.0.1",
        "image": "/meta/hal9000.svg",
        "description": "I'm sorry, Dave. I'm afraid I can't do that.",
        "href": ""
    },
    "children": [
        {
            "data": {
                "id": "AWS",
                "image": "/meta/hal9000.svg",
                "description": "I'm sorry, Dave. I'm afraid I can't do that.",
                "href": ""
            }
        }]
}
let input2 = {
    "data": {
      "id": "Talend Studio 8.0.1",
      "image": "",
      "description": "",
      "href":""
    },
    "children": [
      {
        "data": {
          "id": "AWS",
          "image": "",
          "description": "",
          "href":""
        },
        "children": [
          {
            "data": {
              "id": "AWSSNS",
              "image": "",
              "description": "",
              "href":""
            }
          },
           { 
            "data": {
              "id": "AWS3Bucket",
              "image": "",
              "description": "",
              "href":""
            }
          }
          ]
      },
      {
        "data": {
          "id": "Business Intelligence",
          "image": "",
          "description": "",
          "href":""
        },
        "children": [
          {
            "data": {
              "id": "BISNS",
              "image": "",
              "description": "",
              "href":""
            }
          },
          {
            "data": {
              "id": "BI_Bucket",
              "image": "",
              "description": "",
              "href":""
            }
          }]
      }
    ]
  }
    
  
let objectList = []
// console.log(flattenKeys(input))
//called with every property and its value
function process(key,value) {
    console.log(key + " : "+value)
    if( key == 'id' ) {
        let o = {id : value}
        // console.log(o)
        objectList.push(o)
    }
}

function traverse(o,func) {
    for (var i in o) {
        func.apply(this,[i,o[i]])
        if (o[i] !== null && typeof(o[i])=="object") {
            //going one step down in the object tree
            console.log(' o = ', o)
            traverse(o[i],func);
        }
    }
}
// got the following from: https://stackoverflow.com/questions/62367770/json-accessing-specific-leaf-in-variable-depth-branches

function getLeafComponentNames(data, depth = 0) {
    // if (!data.children) return [{ id: data.data.id, depth }]
    if (!data.children) {
      // console.log(data.data.id,' - -', data.data.description)
      return [{ "component" : data.data.id, "description": data.data.description}]
    }
    const searchData = []
    for (const child of data.children) {
        const n = getLeafComponentNames(child, depth + 1) // DFS recursive, depth increases by 1
        searchData.push(...n)
    }
    return searchData.filter(n => n)
}
const path = '/Users/bindest/Documents/Projects/sveltekit-flexsearch-main/src/routes/search.json/Componentsv801.json'
const path2 = './smallComponentData.json'
  
  fs.readFile(path, 'utf8', (err, file) => {
  // check for any errors
    if (err) {
        console.error('Error while reading the file:', err)
        return
    }
    try {
        const data = JSON.parse(file)
        console.log(typeof(data))
      // output the parsed data
      // console.log('here is the data', file)
     // console.log(Object.entries(data))
        // traverse(data, process)
      let depth = 0
      const d = getLeafComponentNames(data, depth = 0)

      console.log(d)

    } catch (err) {
      console.error('Error while parsing JSON data:', err)
    }
  })
// keys.forEachconsole.log('Here is objectList: ', objectList)
fs.writeFile(
    "output.json",
    JSON.stringify(objectList),
    // objectList,
    err => {
        // Checking for errors 
        if (err) throw err;

        // Success 
        console.log("Done writing");
    }); 