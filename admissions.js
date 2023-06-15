function fetchComments(url) {
    return fetch(url).then(function(response) {
        return response.json()
    }).then(function(json) {
        const rawData = json[1].data.children
        const postsWithAdmissionData = rawData.filter(post => post.data.body?.includes('Status'))
        return postsWithAdmissionData.map(post => post.data.body)
    })
}

function plotDaysOfWeek(dates, year) {
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
        width: window.screen.width,
        title: `Fall ${year} Decision Days of Week`,
        font:{
            family: 'Courier New, monospace'
        },
    };
    Plotly.newPlot(`${year}FallDaysOfWeek`, data, layout);
}

function plotDates(dates, year) {
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
        title: `Fall ${year} Decision Dates`,
        width: window.screen.width,
        font:{
          family: 'Courier New, monospace'
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
      
    Plotly.newPlot(`${year}FallDates`, data, layout);
}

function cleanDates(data, year) {
    const dataAsDates = data.map(post => {
        const decisionDateArray = post.split('\n').find(line => line.includes('Decision'))?.split(' ')
        const decisionDateString = decisionDateArray?.slice(2, decisionDateArray.length)?.join('')
        return moment(decisionDateString || "invalid")
    })
    return dataAsDates.filter(date => date.isValid() && date.year() == year)
}

function plotQuartiles(dates, year) {
    const formattedDates = dates.map(date => date.format("YYYY-MM-DD"))
    const sortedDates = dates.sort((a, b) => a - b);
    const mid = Math.floor(sortedDates.length / 2)
    const median = sortedDates.length % 2 !== 0 ? sortedDates[mid] : (sortedDates[mid - 1] + sortedDates[mid]) / 2
    console.log(`median acceptance date for ${year}`, median)

    var data = [{
        x: formattedDates,
        type: 'box',
        name: year,
    }];

    var layout = {
        title: `Fall ${year} Decision Dates Boxplot`,
        width: window.screen.width,
        font:{
            family: 'Courier New, monospace'
        },
    };

    Plotly.newPlot(`${year}FallQuartiles`, data, layout);
}

async function getDecisionDates(url, year) {
    const data = await fetchComments(url);
    const formattedData = cleanDates(data, year)
    plotDates(formattedData, year)
    plotDaysOfWeek(formattedData, year)
    if (year != 2023) { plotQuartiles(formattedData, year) }
}

getDecisionDates('https://www.reddit.com/r/OMSCS/comments/lqv04x/fall_2021_admissions_thread.json', 2021)
getDecisionDates('https://www.reddit.com/r/OMSCS/comments/spbavt/fall_2022_admissions_thread.json', 2022)
getDecisionDates('https://www.reddit.com/r/OMSCS/comments/11i163s/fall_2023_admissions_thread.json', 2023)
