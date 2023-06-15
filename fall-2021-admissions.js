function fetchComments(url) {
    return fetch(url).then(function(response) {
        return response.json()
    }).then(function(json) {
        const rawData = json[1].data.children
        const postsWithAdmissionData = rawData.filter(post => post.data.body?.includes('Status'))
        return postsWithAdmissionData.map(post => post.data.body)
    })
}

function plotDaysOfWeek(dates) {
    const formattedDates = dates.map(date => date.format('dddd'))
    const counts = {};
    formattedDates.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    const labels = []
    const values = []
    for (let [key, value] of Object.entries(counts)) {
        labels.push(key)
        values.push(value)
    }
    var data = [{
        values: values,
        labels: labels,
        type: 'pie'
    }];
    
    var layout = {
        height: 400,
        width: 500,
        title: 'Fall 2021 Decision Days of Week',

    };
    Plotly.newPlot('2021FallDaysOfWeek', data, layout);
}

function plotDates(dates) {
    const formattedDates = dates.map(date => date.format("YYYY-MM-DD"))
    const counts = {};
    formattedDates.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    const xArray = []
    const yArray = []
    for (let [key, value] of Object.entries(counts)) {
        xArray.push(key)
        yArray.push(value)
    }

    var data = [
        {
          x: xArray,
          y: yArray,
          type: 'bar',
          text: yArray.map(String),
          textposition: 'outside',
        }
    ];

    var layout = {
        title: 'Fall 2021 Decision Dates',
        font:{
          family: 'Raleway, sans-serif'
        },
        showlegend: false,
        xaxis: {
          tickangle: -45
        },
        yaxis: {
          zeroline: false,
          gridwidth: 2
        },
        bargap :0.05
      };
      
    Plotly.newPlot('2021FallDates', data, layout);
}

function cleanDates(data) {
    const dataAsDates = data.map(post => {
        const decisionDateArray = post.split('\n').find(line => line.includes('Decision')).split(' ')
        const decisionDateString = decisionDateArray.slice(2, decisionDateArray.length).join('')
        return moment(decisionDateString)
    })
    return dataAsDates.filter(date => date.isValid() && date.year() == '2021')
}

async function getDecisionDates(url) {
    const data = await fetchComments(url);
    const formattedData = cleanDates(data)
    plotDates(formattedData)
    plotDaysOfWeek(formattedData)
}

getDecisionDates('https://www.reddit.com/r/OMSCS/comments/lqv04x/fall_2021_admissions_thread.json')

// when do people get accepted?
// does their accept/reject status have anything to do with it?
// does their country have anything to do with it?
// does their application date have anything to do with it?