
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");


var orgID;
module.exports = {

    update : async function(accessToken,orgEmail,subject,time,room)
    {
        var orgid;
        var meetingID;
        return new Promise(async function(resolve, reject)
        {
            //console.log("meeting id started")
            const client = MicrosoftGraph.Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null, accessToken);
                },
            });
            orgid = await module.exports.getOrganizerID(accessToken,orgEmail).then(res=>res);
            meetingID = await module.exports.getMeetingID(accessToken,orgid,subject,time).then(res=>res);
            const _location = {
                location: 
                        {
                            displayName: room
                        }
             }
            client
            .api('/users/' + orgid + '/calendar/events/' + meetingID)	
            .patch(_location)
            .then((res) => {
                console.log("Location Update successful");
                resolve(res);
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
            
        });
    },

 getOrganizerID: async function (accessToken,orgEmail)
{
    return new Promise(function(resolve, reject)
    {
        const client = MicrosoftGraph.Client.init({
            defaultVersion: "v1.0",
            debugLogging: true,
            authProvider: (done) => {
                done(null, accessToken);
            },
        });
        client
        .api('/Users')	
        .get()
        .then((res) => {
            //console.log(res);
            
            for(let i in res.value) //go through all users
            {
                
                if(res.value[i].mail == orgEmail)
                {
                    orgID = res.value[i].id;
                    //console.debug(orgEmail + " has id of " + orgID);
                    return resolve(orgID);
                }
             
            }
 
                reject(" Could not find organizer ID in tenant");
            
        })
        .catch((err) => {
            console.log(err)
            reject(err);
        });
    
    });
},

getMeetingID : async function (accessToken,orgid,subject,time)
{
    return new Promise(async function(resolve, reject)
        {
            //console.log("meeting id started")
            const client = MicrosoftGraph.Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null, accessToken);
                },
            });
            client
            .api('/users/'+orgid+'/calendar/events?$select=id,subject,start')	
            .get()
            .then((res) => {
                //console.log("Worked");
                //console.log(res);
                for(let i in res.value) //go through all users
                {
                    
                    stime = new Date(res.value[i].start.dateTime);
				    time = new Date(time);
                    //console.log("TIME FOUND " + res.value[i].start.dateTime +"=="+ time);
                    var diff = stime-time;
                    diff =  Math.floor(diff / 60e3);
                    //console.log("SUBJ " + res.value[i].subject +"=="+ subject);
                    //console.log("DIFF " + diff);
                    if(res.value[i].subject == subject && diff == 0)
                    {
                    //console.debug("meeting found " + res.value[i].id);
                    return resolve(res.value[i].id);
                    }
                    else
                    {
                        reject();
                    }
                }
                
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
            
        });
}

};
