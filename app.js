// Initialize Selected Bar Chart
function dropDwnGen(){
    d3.json("../data/samples.json").then((jsonData) => {
        // console.log(jsonData);
    
        const samplesArray = jsonData.names;
        // console.log(samplesArray);

        //html dropDown selector
        const dropDwnSelect = d3.select("#selDataset");

        samplesArray.forEach(sample =>{
            const option = dropDwnSelect.append("option");
            option.text(sample).property("value",sample);
        })
    });
};

function buildplot(sampleID){
    d3.json("../data/samples.json").then((jsonData) => {
        const samples = jsonData.samples;
        // console.log(samples);

        const filteredId = samples.filter(i =>
            i.id.toString() === sampleID
        )
        // console.log(filteredId);

        const sampleValues = filteredId[0].sample_values.slice(0,10).reverse();
        const otuValues = filteredId[0].otu_ids.slice(0,10).reverse();
        const genusValues = filteredId[0].otu_labels.slice(0,10).reverse();
        const genusArr = genusValues.map(genvalue =>
            genvalue.split(";").slice(-1)
        )
        // console.log(sampleValues);
        // console.log(otuValues);
        // console.log(genusValues);
        // console.log(genusArr);

        // create an array with "otuValues" and "genusArr"
        const otuGenus = [];
        
        otuValues.forEach((ov,i) => {
            const ovString = ov + " : " + genusArr[i]
            otuGenus.push(ovString)
        })
        // console.log(otuGenus);

        //bar plot with selection

        const trace = {
            x: sampleValues,
            y: otuGenus,
            type: "bar",
            orientation: "h",
            text: genusValues,
        }
        const data = [trace];

        layout = {
            title: "Top 10 Bacteria - Selected Subject",
            xaxis: {tickfont: {
                size: 12,
            }},
            yaxis: {tickfont: {
                size: 8,
            }},
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        }

        Plotly.newPlot("bar2",data,layout);

        //bar plot without selection
        const otuIDArray = samples.map(sample =>
            sample.otu_ids)
        // console.log(otuIDArray);

        const sampleValuesArray = samples.map(sample =>
            sample.sample_values);
        // console.log(sampleValuesArray);

        const otuSampleObject = {};
        
        otuIDArray.forEach((otuSubject,index) => {

            // console.log(otuSubject);
            const sampleSubject = sampleValuesArray[index];

            otuSubject.forEach((otuID,i) => {

                        if (otuID in otuSampleObject){
                            otuSampleObject[otuID].push(sampleSubject[i])
                        }
                        else {
                            otuSampleObject[otuID] = [sampleSubject[i]];
                        }
            })
        });
        console.log(otuSampleObject);
    });    
};

function demographicInfo(sampleID){
    d3.json("../data/samples.json").then(res =>{
        const metadataObj = res.metadata;
        console.log(metadataObj);
        const filteredMetaObj = metadataObj.filter(metaObj =>
        metaObj.id.toString() === sampleID)
        const demographicInfo = filteredMetaObj[0]
        // console.log(demographicInfo);
        
        // wipe out "Demographic Info" dection every time the subject id is updated
        d3.select("#sample-metadata").text(" ");

        //html "Demographic Info" selector
        const demographicInfoRef = d3.select("#sample-metadata");

        Object.entries(demographicInfo).forEach(([key,value]) =>{
            const divElem = demographicInfoRef.append("div")
            divElem.text(`${key}:${value}`);
        })

    });

};

function optionChanged(sampleID){
    console.log(sampleID);
    buildplot(sampleID);
    demographicInfo(sampleID);
}

// init function to render a default chart

function init(){
    d3.json("../data/samples.json").then((jsonData) => {
        let initialID = jsonData.samples[0].id;
        console.log(initialID);
        buildplot(initialID);
        demographicInfo(initialID);   
    });
};

dropDwnGen();
init();

