
import {useState, useEffect } from 'react'
import ActivityGroup from './ActivityGroup.jsx'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs'
import Button from 'react-bootstrap/Button';

function ActivityFeed() {
    const [activities, setActivities] = useState([])
    const [archivedActivities, setArchivedActivities] = useState([])
    useEffect(() => {
        
        getActivities()
    }, []);
    

    const getActivities = () => {
        setActivities([])
        setArchivedActivities([])
        fetch('https://aircall-backend.onrender.com/activities').then((response) => {
            console.log(response)
            return response.json()
        }).then((data) => {
            const sortedActivity = data.reduce((sortedActivity, activity) => {
                const date = activity.created_at.split('T')[0];
                if (!sortedActivity[date]) {
                    sortedActivity[date] = []
                }
                if (activity.is_archived == false){
                    sortedActivity[date].push(activity)
                }
                
                return sortedActivity
            }, {})

            const sortedActivityArrays = Object.keys(sortedActivity).map((date) => {
                return {
                    date,
                    activity: sortedActivity[date]
                };
                });
                console.log('here', sortedActivityArrays)
            setActivities(sortedActivityArrays)

            const sortedArchivedActivity = data.reduce((sortedArchivedActivity, activity) => {
                const date = activity.created_at.split('T')[0];
                if (!sortedArchivedActivity[date]) {
                    sortedArchivedActivity[date] = []
                }
                if (activity.is_archived == true){
                    sortedArchivedActivity[date].push(activity)
                }
                
                return sortedArchivedActivity
            }, {})

            const sortedArchivedActivityArrays = Object.keys(sortedArchivedActivity).map((date) => {
                return {
                    date,
                    activity: sortedArchivedActivity[date]
                };
                });
                console.log('here', sortedArchivedActivityArrays)
            setArchivedActivities(sortedArchivedActivityArrays)
        })
    }

    const unarchiveAll = () => {
        fetch('https://aircall-backend.onrender.com/reset/', 
            {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    }, 
                }).then((response) => {
                    getActivities()
                    setActiveTab("allCalls")
                })
    }

    const archiveAll = () => {
        let promiseArr = [];
        for (let activityGroup in activities){
            for (let activity in activities[activityGroup].activity){
                promiseArr.push(fetch('https://aircall-backend.onrender.com/activities/' + activities[activityGroup].activity[activity].id, 
                    {
                        method: "PATCH",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                            }, 
                        body: JSON.stringify({is_archived: !activities[activityGroup].activity[activity].is_archived})}).then((response) => {

                        }))
            }      
        }
        Promise.all(promiseArr).finally(() => {
            getActivities()
            setActiveTab("archivedCalls")
        })
        
        
    }


    return (
        <Tabs
            defaultActiveKey="allCalls"
            id="activityTabs"
            variant="underline"
            className="mb-3"
            justify
        >
            <Tab eventKey="allCalls" title="Calls">
                <Button onClick={() => archiveAll()} variant="secondary" className="mb-3" size="sm" style={{width: '100%'}}>Archive all Calls</Button>
                {activities.filter((activity) => {
                    return activity.activity.length > 0
                }).map((activityGroup) => (
                    
                    <ActivityGroup key={activityGroup.date} activityGroup={activityGroup} isArchived={false}></ActivityGroup>
                ))}
            </Tab>
            <Tab eventKey="archivedCalls" title="Archived">
            <Button onClick={() => unarchiveAll()} variant="secondary" className="mb-3" size="sm" style={{width: '100%'}}>Unarchive all Calls</Button>
                {archivedActivities.filter((activity) => {
                    return activity.activity.length > 0
                }).map((activityGroup) => (
                    
                    <ActivityGroup key={activityGroup.date} activityGroup={activityGroup} isArchived={true}></ActivityGroup>
                ))}
            </Tab>
        </Tabs>
    )
}

export default ActivityFeed