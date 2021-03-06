'use strict';


var express = require('express');
var path = require('path');
var http = require('http');
var app = express();
let fs = require('fs');
let fastcsv = require('fast-csv');
let readableStreamInput = fs.createReadStream('public/data/musicdata.csv');
let csvData = [];
let pays=[];
let k=0;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, function(req, res) {
  console.log('en ecoute sur le port 3000');
});
fastcsv.fromStream(readableStreamInput, {headers: true,strictColumnHandling: true})
        .on('data', (data) => {
        let rowData = {};
        let row={};
        Object.keys(data).forEach(current_key => {
        rowData[current_key] = data[current_key];

        });
       csvData.push(rowData);

        }).on('end', () => {
         //console.log("récupération");
          //console.log(csvData);

          k=1;

    });
app.get('/data', function(req,resp){

if(k==1){

  resp.send(JSON.stringify(csvData));
  //console.log(csvData);
}



});

    app.get('/BlogParGenre', function(req,resp){
    let   resultat={};
    let genrefollowers=[];
      let rowData = {};
      if(k==1){

        for(var i=0;i<csvData.length;i++)
        {

          if(resultat[csvData[i].Genre]==null)
          {
              resultat[csvData[i].Genre]=1;
          }
          else{
            resultat[csvData[i].Genre] += 1;
          }
        }
        resp.send(JSON.stringify(resultat));
    }
    });



    app.get('/pays', function(req,resp){

    let pays=[];
    let row={};

      if(k==1){

        for(var i=0;i<csvData.length;i++)
        {

          if(! pays.includes(csvData[i].Country))
          {
              //row["Genre"]=csvData[i].Genre;


            pays.push(csvData[i].Country);
          }
          else{
            //console.log("element existant");
          }
        }
        //console.log(genremusicales);
        resp.send(JSON.stringify(pays));

}
});
app.get('/tracks/:genre', function(req,resp){
  //il faut enlever les espaces de tous les genre qui contient des espaces, sinon ça donne pas un résultat
  var p = escape(req.params.genre);
  var p1=p.replace("%20"," ");

  //console.log("p1",p1);
  let tracksgenre=[];
  let rowData = {};
    if(k==1){

      for(var i=0;i<csvData.length;i++)
      {
      //console.log(csvData[i].Genre);
            if(csvData[i].Genre == p1)
            {
              rowData["id"]=csvData[i].id;
              rowData["x1"] = csvData[i].Name;
              rowData["y1"] = csvData[i].Tracks;
              rowData["z1"] = csvData[i].Followers;
              rowData["pays"]=csvData[i].Country;
              tracksgenre.push(rowData);
              rowData={};

            }
            else{
              //console.log("false");
            }

      }
      //tracksgenre.sort(sortByy1);

console.log(tracksgenre);
      resp.send(JSON.stringify(tracksgenre));
  }

});
function sortByy1(key1, key2){
  console.log("y1",key1.y1);
  console.log("y2",key2.y1);
   return key1.y1 > key2.y1;
}
app.get('/followers/:genre', function(req,resp){
  //il faut enlever les espaces de tous les genre qui contient des espaces, sinon ça donne pas un résultat
;
  var p = escape(req.params.genre);
  var p1=p.replace("%20"," ");

  console.log("p1",p1);
  let followersgenre=[];
  let rowData = {};
    if(k==1){

      for(var i=0;i<csvData.length;i++)
      {
            if(csvData[i].Genre == p1)
            {
              rowData["id"]=csvData[i].id;
              rowData["x1"] = csvData[i].Name;
              rowData["y1"] = csvData[i].Followers;
              rowData["z1"] = csvData[i].Tracks;
              rowData["pays"]=csvData[i].Country;
              followersgenre.push(rowData);
              rowData={};

            }


      }
      followersgenre.sort(sortByy1);
      console.log(followersgenre);
  resp.send(JSON.stringify(followersgenre));
  }

});
app.get('/indice/:genre', function(req,resp){
  //il faut enlever les espaces de tous les genre qui contient des espaces, sinon ça donne pas un résultat
;
  var p = escape(req.params.genre);
  var p1=p.replace("%20"," ");

  console.log("p1",p1);
  let followersgenre=[];
  let rowData = {};

    if(k==1){

      var nbmaxfollowers= csvData.reduce((max, b) => Math.max(max, b.Followers), csvData[0].Followers);
      console.log(nbmaxfollowers);
      /*for(var i=0;i<csvData.length;i++)
      {
            if(csvData[i].Genre == p1)
            {
              rowData["id"]=csvData[i].id;
              rowData["x1"] = csvData[i].Name;
              rowData["y1"] = csvData[i].Followers/nbmaxfollowers;
              rowData["z1"] = csvData[i].Tracks;
              rowData["pays"]=csvData[i].Country;
              followersgenre.push(rowData);
              rowData={};

            }


      }*/
      followersgenre.sort(sortByy1);
      console.log(followersgenre);
  resp.send(JSON.stringify(followersgenre));
  }

});
app.get('/artistes/:genre', function(req,resp){
  //il faut enlever les espaces de tous les genre qui contient des espaces, sinon ça donne pas un résultat
  var p = escape(req.params.genre);
  var p1=p.replace("%20"," ");


  let followersgenre=[];
  let rowData = {};
    if(k==1){

      for(var i=0;i<csvData.length;i++)
      {
            if(csvData[i].Genre == p1)
            {

              rowData["NomdeBlog"] = csvData[i].Name;
              rowData["NomDeDernierArtiste"] = csvData[i].ArtistRecentlyposted;
              followersgenre.push(rowData);
              rowData={};

            }


      }
  resp.send(JSON.stringify(followersgenre));
  }

});
app.get('/blogs/:id', function(req,resp){

  var p1=req.params.id;

  //console.log("p1",p1);
  let blog=[];
  let rowData = {};
    if(k==1){

      for(var i=0;i<csvData.length;i++)
      {
            //console.log(csvData[i].id);
            if(csvData[i].id == p1)
            {


              //rowData={};
              Object.keys(csvData[i]).forEach(current_key => {

              if(csvData[i][current_key] != "")
                { rowData[current_key] = csvData[i][current_key];}



              });
              blog.push(rowData);
              break;

            }

      }


      resp.send(JSON.stringify(blog));
  }

});

module.exports = app;
/*

//Quelques fonctionnalités qu'on aura besoin
app.get('/FollowersParPays', function(req,resp){
let   resultat={};
let genrefollowers=[];
  let rowData = {};
  if(k==1){

    for(var i=0;i<csvData.length;i++)
    {

      if(resultat[csvData[i].Country]==null)
      {
          resultat[csvData[i].Country]=parseInt(csvData[i].Followers);
      }
      else{
        resultat[csvData[i].Country]=(parseInt(resultat[csvData[i].Country])+parseInt(csvData[i].Followers));
      }
    }
    resp.send(JSON.stringify(resultat));
}
});
app.get('/BlogParPays', function(req,resp){
let   resultat={};
let genrefollowers=[];
  let rowData = {};
  if(k==1){

    for(var i=0;i<csvData.length;i++)
    {

      if(resultat[csvData[i].Country]==null)
      {
          resultat[csvData[i].Country]=1;
      }
      else{
        resultat[csvData[i].Country] += 1;
      }
    }
    resp.send(JSON.stringify(resultat));
}
});
app.get('/TracksParGenre', function(req,resp){
let   resultat={};
let genrefollowers=[];
  let rowData = {};
  if(k==1){

    for(var i=0;i<csvData.length;i++)
    {

      if(resultat[csvData[i].Genre]==null)
      {
          resultat[csvData[i].Genre]=parseInt(csvData[i].Tracks);
      }
      else{
        resultat[csvData[i].Genre]=(parseInt(resultat[csvData[i].Genre])+parseInt(csvData[i].Tracks));
      }
    }

    resp.send(JSON.stringify(resultat));
}
});
app.get('/FollowersParGenre', function(req,resp){
let   resultat={};
let genrefollowers=[];
  let rowData = {};
  if(k==1){

    for(var i=0;i<csvData.length;i++)
    {

      if(resultat[csvData[i].Genre]==null)
      {
          resultat[csvData[i].Genre]=parseInt(csvData[i].Followers);
      }
      else{
        resultat[csvData[i].Genre]=(parseInt(resultat[csvData[i].Genre])+parseInt(csvData[i].Followers));
      }
    }
    resp.send(JSON.stringify(resultat));
}
});


*/
// function que
