## API USAGE
## Tous les endpoints sont accessibles via method POST
## /signup 

```node
    
    {
        "username":"",
        "password":"",
        "email":"",
        "org":""
    }

    ## return {
        "user": "",
        "ok": "User created"
    }

```

## /login 

```node
    
    {
        "username":"",
        "password":"",
    }

    ## return {
        "token":""
    }
```

## /balancing-authority 

```node
    
    {
    "lag":"",
    "long":"",
    "token":""
    }

    ## return {
        "abbrev": "",
        "name": "",
        "id": 1
    }
```

## /real-time-emission-index

```node
    
    {
        "ba":"",    
        "lag":"",   
        "long":"",  
        "token":""
    }

    ## sois ba ou longitude et lagitude

    ## return {
        "ba": "CAISO_NORTH",
        "freq": "300",
        "percent": "73",
        "moer": "950",
        "point_time": "2022-01-12T16:45:00Z"
    }
```

## /grid-emission-data

```node
    
    {
        "ba":"",    
        "token":""
    }


    ## return [
        {
            "point_time": "2022-01-12T16:45:00Z",
            "value": "950",
            "frequency": 300,
            "market": "RTM",
            "ba": "CAISO_NORTH",
            "datatype": "MOER",
            "version": "3.0"
        }
    ]
```

## /emission-forecast

```node
    
    {
        "ba":"CAISO_NORTH",
        "starttime":"2021-08-05T09:00:00-0400",
        "endtime":"2021-08-05T09:05:00-0400",
        "token":""
    }


    ## return [
    {
        "forecast": [
            {
                "ba": "CAISO_NORTH",
                "point_time": "2021-08-05T09:10:00+00:00",
                "value": 947.6302583179771,
                "version": "3.0-1.0.0"
            },
            {
                "ba": "CAISO_NORTH",
                "point_time": "2021-08-05T09:15:00+00:00",
                "value": 946.0824163831867,
                "version": "3.0-1.0.0"
            },
            ...
        ]
```

## /historical-emission

```node
    
    {
        "ba":"",    
        "token":""
    }


    ## return binary data # recuperable sous forme de zip 
```
