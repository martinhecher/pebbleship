define({ "api": [
  {
    "type": "post",
    "url": "/grid/",
    "title": "Create grid",
    "version": "0.1.0",
    "name": "PostGrid",
    "group": "Grid",
    "description": "<p>Create a new grid (x,y). The game is reset internally.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "x",
            "description": "<p>Number of columns</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "y",
            "description": "<p>Number of rows</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n{\n  \"x\": 10,\n  \"y\": 10,\n  \"id\": 1,\n  \"createdAt\": \"2016-03-06T11:38:25.146Z\",\n  \"updatedAt\": \"2016-03-06T11:38:25.146Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/GridController.js",
    "groupTitle": "Grid"
  }
] });
