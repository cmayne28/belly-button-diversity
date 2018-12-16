function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var data = d3.json(`/metadata/${sample}`);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    data.then((bellybutton) => {
      Object.entries(bellybutton).forEach(([key, value]) => {
        panel
          .append("h6")
          .text(`${key}: ${value}`);
        }
          )})
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var chartData = d3.json(`/samples/${sample}`); 

    //var bubble = d3.select("#bubble");
    
    //console.log(chartData)

    //@TODO: Build a Bubble Chart using the sample data
    chartData.then(function(response) {
      console.log(response);

      var otu_ids = response.otu_ids
      var sample_values = response.sample_values
      var otu_labels = response.otu_labels

      console.log(otu_ids)
      console.log(sample_values)
      console.log(otu_labels)

      var trace = {
        type: "scatter",
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {size: sample_values, color: otu_ids, colorscale: "Portland"},
        text: otu_labels 
      };

      var layout = {
        title: `Belly Button Bubbles`, 
        xaxis: {title: 'OTU IDs'}, yaxis: {title: "Sample Values"} };

      console.log(layout)
     
      bubbledata = [trace];
     
      Plotly.newPlot("bubble", bubbledata, layout)
      //   })
      // }
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pie = d3.select("#pie");

    var otu_ids_10 = otu_ids.reverse().slice(0,10)
    var sample_values_10 = sample_values.reverse().slice(0,10)
    var otu_labels_10 = otu_labels.reverse().slice(0,10)

    console.log(otu_ids_10)
    console.log(sample_values_10)
    console.log(otu_labels_10)

    var pieTrace = {
      values: sample_values_10,
      labels: otu_ids_10,
      type: "pie",
      text: otu_labels_10,
      hoverinfo: "label+text+value+percent",
      textinfo: "percent"}

    var data = [pieTrace]

    Plotly.newPlot("pie", data)

    })}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
