$( ".change" ).each(function( i ) {

// THIS IS TO CHANGE STRING FROM ID INTO A COMPARABLE STRING TO THE DATABASE
var constituency = this.id;
var word = ""
var con1 = constituency.split(/(?=[A-Z])/);
for (i=0;i<con1.length;i++){
  var inde = con1[i].indexOf("and");
  if(inde !== -1){
    var part1 = con1[i].slice(0, inde);
    var part2 = con1[i].slice(inde);
    con1[i] = part1 + " " + part2;
  };
};
word += con1
word = word.replace(",", " ")
console.log(word)
if (word === "Cardiff South and,Penarth"){
  word = "Cardiff South and Penarth"
} else if (word === "Carmarthen East and,Dinefwr"){
  word = "Carmarthen East and Dinefwr"
} else if (word === "Carmarthen West and,South,Pembrokeshire"){
  word = "Carmarthen West and South Pembrokeshire"
} else if (word ==="Merthyr Tydfil and,Rhymney"){
  word = "Merthyr Tydfil and Rhymney"
} else if ( word === "Valeof Clwyd"){
  console.log("hi")
  word = "Vale Of Clwyd"
} else if(word === "Valeof Glamorgan"){
  console.log("glam")
  word = "Vale Of Glamorgan"
}


// END




// THE NEXT SECTION INITIATES THE SVG

var width = $( ".change" ).width();
var height = $( ".change" ).height();
var margin = {top: 10, right: 10, bottom: 10, left: 10}

var svg = d3.select(this).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", constituency+"chart")
    .on("mouseover", function(d){
      console.log(this.id);
    });

    // set the ranges
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);



d3.json(data2015, function(error, data){
  if (error) throw error;
  //console.log(data);
  // Scale the range of the data in the domains
  x.domain(d3.extent(data, function (d) {
      //console.log(d["Party abbreviation"])
      return d["Change"];
  }));
  y.domain(data.map(function (d) {
    //console.log(d["Share (%)"])
      return d["Party abbreviation"];
  }));

var newData = []

  data.forEach(function(d) {
    //console.log(d);
      if (d["Constituency Name"] === word){
        //console.log('match');
        newData.push(d)
      }
  });

  svg.selectAll(".bar")
      .data(newData)
      .enter().append("rect")
      .attr("class", function (d) {
          return "bar bar--" + (d["Change"] ? "negative" : "positive");
      })
      .attr("x", function (d) {

          //console.log(d["Change"])
          if ( isNaN(x(Math.min(0, d["Change"])))){
            return x(0);
          } else{
            return x(Math.min(0, d["Change"]));
          }

      })
      .attr("y", function (d) {
          return y(d["Party abbreviation"]);
      })
      .attr("width", function (d) {
          return Math.abs(x(d["Change"]) - x(0) );

      })
      .attr("height", y.bandwidth())
      .style("fill", function(d){
        if(d["Party abbreviation"]==="Lab"){
          return "red"
        } else if(d["Party abbreviation"]==="Con"){
          return "blue"
        }
        else if(d["Party abbreviation"]==="LD"){
          return "yellow"
        } else if(d["Party abbreviation"]==="PC"){
          return "green"
        } else if(d["Party abbreviation"]==="UKIP"){
          return "purple"
        }
      });
});

});
