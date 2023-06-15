function fetchComments(url) {
    return fetch(url).then(function(response) {
        return response.json()
    }).then(function(json) {
        const rawData = json[1].data.children
        const postsWithAdmissionData = rawData.filter(post => post.data.body?.includes('Status'))
        return postsWithAdmissionData.map(post => post.data.body)
    })
    // if (url) {
    //     fetch('https://www.reddit.com/r/' + url + '.json').then(function(response) {
    //     return response.json();
    //     }).then(function(json) {
    //     var links = '';
    //     for (var i = 0; i < json.data.children.length; i++) {
    //         links += '<li><a href="' + json.data.children[i].data.url + '">' +
    //         json.data.children[i].data.url + '</a></li>';
    //     }
    //     entriesEl.innerHTML = '<ul>' + links + '</ul>';
    // });
    // }
}

async function getDecisionDates(url) {
    const data = await fetchComments(url);
    const dates = data.map(post => {
        const decisionDateArray = post.split('\n').find(line => line.includes('Decision')).split(' ')
        return decisionDateArray.slice(2, decisionDateArray.length).join('')
    })
    console.log(dates)
    return dates
}

getDecisionDates('https://www.reddit.com/r/OMSCS/comments/lqv04x/fall_2021_admissions_thread.json')

// when do people get accepted?
// does their accept/reject status have anything to do with it?
// does their country have anything to do with it?
// does their application date have anything to do with it?