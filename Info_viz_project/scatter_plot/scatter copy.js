
// http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e

var margin = { top: 50, right: 10, bottom: 50, left: 50 },
    outerWidth = 800 //1050
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right, 
    height = outerHeight - margin.top - margin.bottom;

var currentSearchTerm = "";
// var currentSearchTerm = "";

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var color = d3.scale.linear().range(["#ff6464", "#190000"]);

var xCat = "critic_score",
    yCat = "imdb_score",
    rCat = "Winner",
    colorCat = "budget",
    award = "Award",
    dir = "Diretor_name"
    mov = "Movie_name"


  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

    

  // var color = d3.scale.category10();
  d3.csv("awardmovies.csv", function(data) {
  data.forEach(function(d) {
    d.critic_score = +d.critic_score;
    d.imdb_score = +d.imdb_score;
    d.Winner = +d.Winner;
    d.Award = +d.Award;
    d.Movie_name = d.Movie_name;
    d.Movie_url = d.Movie_url;
    d.Plot_summary = d.Plot_summary;
    d.Diretor_name = d.Diretor_name;
    d.actor1_name = d.actor1_name;
    d.actor2_name = d.actor2_name;
    d.actor3_name = d.actor3_name;
    d.actor4_name = d.actor4_name;
    d.movie_id = d.movie_id;
    d.Year = d.Year;
    d.budget = +d.budget;
    d.gross = +d.gross;


  });
var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin,
      colMax = d3.max(data, function(d) { return d[colorCat]; }),
      colMin = d3.min(data, function(d) { return d[colorCat]; })
      // colMin = colMin > 0 ? 0 : colMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  // color.domain(d3.extent(data, function(d) { return d.budget; })).nice();
  color.domain([colMin, colMax]);

  
  

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "Movie: "+ d[mov]+ "<br>" + "<img src= "+ "posters/poster_"+d.movie_id+ ".jpeg" 
        + " height=" + "\"50\"" + "  width="+ "\"50\""+">"

        +"<br>"+"Critic Score: " + d[xCat] + "<br>" + "IMDB Score : " 
        + d[yCat] +  "<br>" + "Director: " + d[dir]+  "<br>" + "Budget: " + d[colorCat] + "<br>" + "Wins: " + d.Winner 
        + "<br>"+ "Nominations: " + d.Award+ "<br>"+ "Actors: " + d.actor1_name + ", " + d.actor2_name + ", " + d.actor3_name + ", " + d.actor4_name
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight + 100) 
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      
      .call(zoomBeh);



  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      // .style("border-style","solid")
      // .style("border-width","20px" )
      // .style("border-color", "black");


  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width + 200)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text("Critic Score");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height)
      // .style("border-style","solid")
      // .style("border-width","20px" )
      // .style("border-color", "black");


  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
  

      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      // .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("r", function(d) { if (d.Winner == 0) { return 3; }  else { return (6 * Math.sqrt(d[rCat] / Math.PI)) + 2; } })
      // .attr("cx", function(d) { return x(d.critic_score); })
      // .attr("cy", function(d) { return y(d.imdb_score); })
      // else if ((d.Winner == 1)){ return 4; }
      .attr("transform", transform)

      .style("fill", function(d) { return color(d[colorCat]); })


      .on("mouseover", function(d) {return mouseovered(d) } ) 
      .on("mouseout", function(d) {return mouseouted(d) } )   
      .on('click', function(d) {return mouseovered(d) } );


  // range(["#b20000", "#190000"]);
  
var w = 800, h = 600;
svg.append("text")
      .attr("transform", "translate(10,450)")
      .style("font-size", "70%")
      .text("Budget range");

      // var key = d3.select("body").append("svg").attr("width", w).attr("height", 600);
      var key = svg.append("svg").classed("legend", true).attr("width", 800).attr("height", 600);

      var legend = key.append("defs").append("svg:linearGradient").attr("id", "gradient")
      .attr("x1", "0%").attr("y1", "100%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

      legend.append("stop").attr("offset", "0%").attr("stop-color", "#ff6464").attr("stop-opacity", 1);

      legend.append("stop").attr("offset", "100%").attr("stop-color", "#190000").attr("stop-opacity", 1);

      key.append("rect").attr("width", w - 500).attr("height", h - 570 )
      .style("fill", "url(#gradient)").attr("transform", "translate(10,455)");

      var x1 = d3.scale.linear().range([300, 0]).domain([colMax, colMin]);  

      var xAxis1 = d3.svg.axis().scale(x1).orient("bottom");

      key.append("g").attr("class", "x axis").attr("transform", "translate(10,485)").style("font-size", "50%")
      .call(xAxis1).append("text").style("font-size", "100%").attr("transform", "rotate(0)").attr("y", 30).attr("x", 60)
        .attr("dy", ".71em").style("text-anchor", "end");



svg.append('circle')
      .attr("cx", 400)
      .attr("cy", 45)
      .attr("r", 3).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")


svg.append('circle')
      .attr("cx", 420)
      .attr("cy", 45)
      .attr("r", 4).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")

svg.append('circle')
      .attr("cx", 440)
      .attr("cy", 45)
      .attr("r", 5).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")

svg.append('circle')
      .attr("cx", 460)
      .attr("cy", 45)
      .attr("r", 6).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")

svg.append('circle')
      .attr("cx", 480)
      .attr("cy", 45)
      .attr("r", 7).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")

svg.append('circle')
      .attr("cx", 500)
      .attr("cy", 45)
      .attr("r", 8).attr("fill", "None").attr("stroke","black").attr("stroke-width","3")
     .attr("transform", "translate(10,430)")


      
    var circ_leg = legend.append("text").attr("class", "awardsize").
    text("Size increases ").text("Award Size ").attr("transform", "translate(40,449)");

svg.append("text")
      .attr("transform", "translate(400,450)")
      .style("font-size", "70%")
      .text("No. of awards: Size of data point is proportional to number of wins ")
      
svg.append("text")
      .attr("transform", "translate(400,500)")
      .style("font-size", "50%")
      .text("less/no wins");

svg.append("text")
      .attr("transform", "translate(500,500)")
      .style("font-size", "50%")
      .text(" More wins");

svg.append("text")
      .attr("transform", "translate(9,500.5)")
      .style("font-size", "50%")
      .text("65000");

// }
//Define the div for the tooltip
var svg1 = d3.select("#tooltip")
   
         .style("position", "relative")

          .attr("width", 300)
          .attr("height", 640) 
        
         .style("visibility", "hidden")
          .attr("transform", "translate(0, 00)")
          .text("a simple tooltip");


function mouseovered(d) 
{

  var fulltext = "";

  fulltext = "<br><br><br><br><br><br><br><br>"+"<b>"+"Movie: "+d[mov]+ "<b>" + "<br><br>"+"<img src= "+ "posters/poster_"+d.movie_id+ ".jpeg" 
        + " height=" + "\"300\"" + "  width="+ "\"200\"" + " align = "+ " middle" +">"

        +"<br><br><br>"+"Critic Score: " + d[xCat] + "<br>" + "IMDB Score : " 
        + d[yCat] +  "<br>" + "Director: " + d[dir]+  "<br>" + "Budget: " + d[colorCat] + "<br>" + "Wins: " + d.Winner 
        + "<br>"+ "Nominations: " + d.Award+ "<br>"+ "Actors: " + d.actor1_name + ", " + d.actor2_name + ", " + d.actor3_name + ", " + d.actor4_name

  document.getElementById('tooltip').innerHTML = fulltext;
  
   svg1.style("visibility", "visible");
    
      
}

function mouseouted(d) {

      svg1.style("visibility", "hidden");

  
      
}



  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
 

});

// http://stackoverflow.com/questions/28922246/dynamic-filtering-in-d3-with-html-input


function handleClick(event){
 

  // currentSearchTerm = document.getElementById("myVal").value;
  myawardslow = document.getElementById("myawardslow").value;
  myawardsgrt = document.getElementById("myawardsgrt").value;
  movieterm = document.getElementById("myVal").value;
actorterm = document.getElementById("myVal2").value;
directorterm = document.getElementById("myVal3").value;
mybudgetlow = document.getElementById("mybudgetlow").value;
mybudgetgrt = document.getElementById("mybudgetgrt").value;
myimdblow = document.getElementById("myimdblow").value;
myimdbgrt = document.getElementById("myimdbgrt").value;
mycriticlow = document.getElementById("mycriticlow").value; 
mycriticgrt = document.getElementById("mycriticgrt").value; 

console.log("myawards", myawards);
    console.log(movieterm, actorterm, directorterm, myawardslow,myawardsgrt, myimdb);
    draw(movieterm, actorterm, directorterm, mybudgetlow,mybudgetgrt,
     myawardslow,myawardsgrt, myimdblow,myimdbgrt, mycriticgrt,  mycriticlow );
return false;
}




function Adventure(event){
  currentSearchTerm = 'Adventure'
   myawards = 0
  movieterm = ''
actorterm = ''
directorterm = ''
mybudget = 0;
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm );
return 'Adventure';
}

function Comedy(event){
  currentSearchTerm = 'Comedy'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Bio( event){
  currentSearchTerm = 'Biography'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Action( event){
  currentSearchTerm = 'Action'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Crime( event){
  currentSearchTerm = 'Crime'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}
function Drama( event){
  currentSearchTerm = 'Drama'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}
function History( event){
  currentSearchTerm = 'History'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}
function Music( event){
  currentSearchTerm = 'Music'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}
function Mystery( event){
  currentSearchTerm = 'Mystery'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}
function Rom( event){
  currentSearchTerm = 'Romance'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Sport( event){
  currentSearchTerm = 'Sport'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Thrill( event){
  currentSearchTerm = 'Thriller'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function West( event){
  currentSearchTerm = 'Western'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function War( event){
  currentSearchTerm = 'War'
    console.log(currentSearchTerm);
    gendraw(currentSearchTerm);
return false;
}

function Reset( event){
  
    reset();
return false;
}


 // draw(movieterm, actorterm, directorterm);
var valOpacity = function(d) { 
       if (((d.Movie_name.search(movieterm) != -1) || (d.actor1_name.search(actorterm) != -1) 
       || (d.actor2_name.search(actorterm) != -1) || (d.actor3_name.search(actorterm) != -1)
         || (d.actor4_name.search(actorterm) != -1) || (d.Diretor_name.search(directorterm) != -1) 
         ) && (  ( parseInt(d.budget) >= parseInt(mybudget))
               && (parseInt(d.Winner) >= parseInt(myawards))
               && (parseFloat(d.imdb_score) >= parseFloat(myimdb)) 
              )


         )  {
        console.log("opacity",!isNaN(parseFloat(myimdb)),!isNaN(parseFloat(d.imdb_score)) );
        return 1;
      }
      else {
        return 0;
      }
    };

var valfill = function(d) { 
     if (((d.Movie_name.search(movieterm) != -1) || (d.actor1_name.search(actorterm) != -1) 
       || (d.actor2_name.search(actorterm) != -1) || (d.actor3_name.search(actorterm) != -1)
         || (d.actor4_name.search(actorterm) != -1) || (d.Diretor_name.search(directorterm) != -1) 
         ) && (  ( parseInt(d.budget) >= parseInt(mybudget))
               && (parseInt(d.Winner) >= parseInt(myawards))
               && (parseFloat(d.imdb_score) >= parseFloat(myimdb)) 
              )



         )  {
        console.log("budget", mybudget);
        return 1;
      }
      else {
        return 0;
      }
    };

var valborder = function(d) { 
       if (((d.Movie_name.search(movieterm) != -1) || (d.actor1_name.search(actorterm) != -1) 
       || (d.actor2_name.search(actorterm) != -1) || (d.actor3_name.search(actorterm) != -1)
         || (d.actor4_name.search(actorterm) != -1) || (d.Diretor_name.search(directorterm) != -1) 
         ) && (  ( parseInt(d.budget) >= parseInt(mybudget))
               && (parseInt(d.Winner) >= parseInt(myawards))
               && (parseFloat(d.imdb_score) >= parseFloat(myimdb)) 
              )


         ) 

{
        console.log("awards", myawards);
        return 'black';
      }
      // else {
      //   return 'red';
      // }
    };

  var disp = function(d) { 

    left =  ( (d.Movie_name.search(movieterm) != -1) || (d.actor1_name.search(actorterm) != -1) 
       || (d.actor2_name.search(actorterm) != -1) || (d.actor3_name.search(actorterm) != -1)
         || (d.actor4_name.search(actorterm) != -1) || (d.Diretor_name.search(directorterm) != -1) 
         ) 

   

    right = (     ( parseInt(d.budget) >= parseInt(mybudgetlow))
                &&  ( parseInt(d.budget) <= parseInt(mybudgetgrt))
               && (parseInt(d.Winner) >= parseInt(myawardslow))
                && (parseInt(d.Winner) <= parseInt(myawardsgrt))
               && (parseFloat(d.imdb_score) >= parseFloat(myimdblow)) 
                && (parseFloat(d.imdb_score) <= parseFloat(myimdbgrt)) 
               && (parseFloat(d.critic_score) >= parseFloat(mycriticlow))
               && (parseFloat(d.critic_score) <= parseFloat(mycriticgrt)) 


              )

init= ( (movieterm == "        ") && (actorterm == "        ")&& (directorterm == "        "))

    if (init == true) {
      left = true;

    }
   // if ( (parseInt(mybudget) == 0) || (parseInt(myawards) == 0 )|| (parseFloat(myimdb) == 0)){
   //    right = true;

   //  }
   // if (
   //     ( (d.Movie_name.search(movieterm) != -1) || (d.actor1_name.search(actorterm) != -1) 
   //     || (d.actor2_name.search(actorterm) != -1) || (d.actor3_name.search(actorterm) != -1)
   //       || (d.actor4_name.search(actorterm) != -1) || (d.Diretor_name.search(directorterm) != -1) 
   //       ) 

   //  && (( parseInt(d.budget) >= parseInt(mybudget))
   //             && (parseInt(d.Winner) >= parseInt(myawards))
   //             && (parseFloat(d.imdb_score) >= parseFloat(myimdb)) 
   //            )


   //       ) 


  if (left && right)

           {
        console.log("imdb", left, right, d.Movie_name, movieterm,
         (d.Movie_name.search(movieterm) != -1)

          ,(d.actor1_name.search(actorterm) != -1)
           , (d.actor2_name.search(actorterm) != -1)
           ,(d.actor3_name.search(actorterm) != -1)
          , (d.actor4_name.search(actorterm) != -1)
          ,(d.Diretor_name.search(directorterm) != -1)
          , init  );


        return "visible";
      }
      else {
        console.log("fail","imdb", left, right);
        return "none";
      }
    };



function draw(){
    d3.select("body").selectAll("circle.dot")
    .attr("display",disp).style("opacity", 0.9).style("stroke", 'black');
    // .filter(function(d) { return d.Movie_name  == movieterm })
    // .style("opacity", valOpacity).style("stroke", valborder);
};

function gendraw(){
    d3.select("body").selectAll("circle.dot")
    .attr("display","visible")
    .style("opacity", function(d) { 
     if (d.genres.search(currentSearchTerm) != -1){
      return 1;
     }else
     {
      return 0;
     }
      })
   
    .style("stroke", function(d) { 
     if (d.genres.search(currentSearchTerm) != -1){
      return black;
     }
   })



    
};

function reset(){
    d3.select("body").selectAll("circle.dot").attr("display","visible")
                                 
    

    .style("fill", function(d) { return color(d[colorCat]); }).style("opacity", 0.9).style("stroke", 'None')
};

