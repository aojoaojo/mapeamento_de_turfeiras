var roi = table2;

var pontos = table4.merge(floresta).merge(Agua).merge(Solo).merge(urbano).merge(Turfeiras).merge(TurfeirasUidemar).merge(FlorestaUidemar).merge(AfloramentoUidemar).merge(CampoUidemar);

print(pontos, "numero de pontos");

Map.addLayer(roi, {}, 'sdem', false);

var data_inicial = '2019-05-01';
var data_final = '2019-10-31';
var nuvem = 1;
 
// Carrega Imagens Sentinel-2 BOA.
var s2 = s2
    .filterDate(data_inicial, data_final)
    //filtro por região
    .filterBounds(roi) 
    // Filtro de Nuvens
    .filter(ee.Filter.lte('CLOUD_COVERAGE_ASSESSMENT', nuvem));

print(s2, "Sentinel 2");

var ndvis2 = function (img){
  var c = img.addBands(img.normalizedDifference(['B8', 'B4'])
  .rename('ndvi'));
return c;
};
// Function to calculate Vegetation Index
var iv2 = function (image){
  // Expression for the NDVI
  var ndvi = image.expression(
  '(nir - red) / (nir + red)',
  {
    'red':image.select('B4'),
    'nir': image.select('B8')
  });
  // Add the ndvi raster image in the Image Collection
  image = image.addBands(ndvi.rename('ndvi'));
  
  // Expression for the quocient total blue
  var qtb = image.expression(
  'blue / (green + red)',
  {
    'blue':image.select('B2'),
    'green':image.select('B3'),
    'red':image.select('B4')
  });
  // Add the qtg raster image in the Image Collection
  image = image.addBands(qtb.rename('qtb'));
  
  
  // Expression for the quocient total green
  var qtg = image.expression(
  'green / (blue + red)',
  {
    'blue':image.select('B2'),
    'green':image.select('B3'),
    'red':image.select('B4')
  });
  // Add the qtg raster image in the Image Collection
  image = image.addBands(qtg.rename('qtg'));
  
  // Expression for the quocient total red
  var qtr = image.expression(
  'red / (green + red)',
  {
    'blue':image.select('B2'),
    'green':image.select('B3'),
    'red':image.select('B4')
  });
  // Add the qtr raster image in the Image Collection
  image = image.addBands(qtr.rename('qtr'));
  
  // Return each one raster image calculated 
  return image;
};



//Calcula NDVI e Reduz conforme especificado

var s2_qtb_mean = s2.map(iv2).reduce(ee.Reducer.mean()).select(24);
var s2_qtb_min = s2.map(iv2).reduce(ee.Reducer.min()).select(24);
var s2_qtb_stdDev = s2.map(iv2).reduce(ee.Reducer.stdDev()).select(24);

var s2_qtg_mean = s2.map(iv2).reduce(ee.Reducer.mean()).select(25);
var s2_qtg_min = s2.map(iv2).reduce(ee.Reducer.min()).select(25);
var s2_qtg_stdDev = s2.map(iv2).reduce(ee.Reducer.stdDev()).select(25);

var s2_qtr_mean = s2.map(iv2).reduce(ee.Reducer.mean()).select(26);
var s2_qtr_min = s2.map(iv2).reduce(ee.Reducer.min()).select(26);
var s2_qtr_stdDev = s2.map(iv2).reduce(ee.Reducer.stdDev()).select(26);


//print(s2.map(iv2), "s2 map iv");

//print(s2_ndvi_mean, "s2 ndvi mean");
//print(s2_ndvi_min, "s2 ndvi min");
//print(s2_ndvi_stdDev, "s2 ndvi stdDev");


//Calcula NDVI e Reduz conforme especificado
var s2_ndvi_mean = s2.map(ndvis2).reduce(ee.Reducer.mean()).select(23);
var s2_ndvi_min = s2.map(ndvis2).reduce(ee.Reducer.min()).select(23);
var s2_ndvi_stdDev = s2.map(ndvis2).reduce(ee.Reducer.stdDev()).select(23);

//print(s2_ndvi_mean, "s2 ndvi mean");
//print(s2_ndvi_min,"s2 ndvi min");
//print(s2_ndvi_stdDev, "s2 ndvi stdDev");

/////////////////////////////////////////////////////
// DEM 30 M

var dem_mean = dem.reduce(ee.Reducer.mean()).select(0);
var dem_min = dem.reduce(ee.Reducer.min()).select(0);
var dem_stdDev = dem.reduce(ee.Reducer.stdDev()).select(0);

//print(dem, "dem");
//print(dem_mean, "dem_mean");
//print(dem_min,"dem_min");
//print(dem_stdDev, "dem_stdDev");


///////////////////////////////////////////////////////////////
// Carrega Imagens Landsat 8 

//var path = ''
//var row = ''

var cloud = 50;

var l8 = l8    
    .filterDate(data_inicial, data_final)
    .filterBounds(roi) 
    //.filter(ee.Filter.eq('WRS_PATH', path))
    //.filter(ee.Filter.eq('WRS_ROW', row))
    .filterMetadata('CLOUD_COVER', 'less_than', cloud);
    
print(l8, "Landsat 8");

var ndvil8 = function(img){
  var c = img.addBands(img.normalizedDifference(['SR_B5','SR_B4']));
return c;
};

//////////////////////////// indice IV ////////////////////////////////////
// Function to calculate Vegetation Index
var iv = function (image){
  // Expression for the NDVI
  var ndvi = image.expression(
  '(nir - red) / (nir + red)',
  {
    'red':image.select('SR_B4'),
    'nir': image.select('SR_B5')
  }); 
  // Add the ndvi raster image in the Image Collection
  image = image.addBands(ndvi.rename('ndvi'));
  
  // Expression for the quocient total blue
  var qtb = image.expression(
  'blue / (green + red)',
  {
    'blue':image.select('SR_B2'),
    'green':image.select('SR_B3'),
    'red':image.select('SR_B4')
  });
  // Add the qtg raster image in the Image Collection
  image = image.addBands(qtb.rename('qtb'));
  
  
  // Expression for the quocient total green
  var qtg = image.expression(
  'green / (blue + red)',
  {
    'blue':image.select('SR_B2'),
    'green':image.select('SR_B3'),
    'red':image.select('SR_B4')
  });
  // Add the qtg raster image in the Image Collection
  image = image.addBands(qtg.rename('qtg'));
  
  // Expression for the quocient total red
  var qtr = image.expression(
  'red / (green + red)',
  {
    'blue':image.select('SR_B2'),
    'green':image.select('SR_B3'),
    'red':image.select('SR_B4')
  });
  // Add the qtr raster image in the Image Collection
  image = image.addBands(qtr.rename('qtr'));
  
  // Expression for the quocient total red
  var temp = image.expression(
  'temp',
  {
    'temp':image.select('ST_B10')
  });
  // Add the qtr raster image in the Image Collection
  image = image.addBands(temp.rename('temp'));
  
  // Return each one raster image calculated 
  return image;
};



//Calcula NDVI e Reduz conforme especificado
var l8_ndvi_mean = l8.map(iv).reduce(ee.Reducer.mean()).select(19);
var l8_ndvi_min = l8.map(iv).reduce(ee.Reducer.min()).select(19);
var l8_ndvi_stdDev = l8.map(iv).reduce(ee.Reducer.stdDev()).select(19);

var l8_qtb_mean = l8.map(iv).reduce(ee.Reducer.mean()).select(20);
var l8_qtb_min = l8.map(iv).reduce(ee.Reducer.min()).select(20);
var l8_qtb_stdDev = l8.map(iv).reduce(ee.Reducer.stdDev()).select(20);

var l8_qtg_mean = l8.map(iv).reduce(ee.Reducer.mean()).select(21);
var l8_qtg_min = l8.map(iv).reduce(ee.Reducer.min()).select(21);
var l8_qtg_stdDev = l8.map(iv).reduce(ee.Reducer.stdDev()).select(21);

var l8_qtr_mean = l8.map(iv).reduce(ee.Reducer.mean()).select(22);
var l8_qtr_min = l8.map(iv).reduce(ee.Reducer.min()).select(22);
var l8_qtr_stdDev = l8.map(iv).reduce(ee.Reducer.stdDev()).select(22);

var l8_temp_mean = l8.map(iv).reduce(ee.Reducer.mean()).select(23);
var l8_temp_min = l8.map(iv).reduce(ee.Reducer.min()).select(23);
var l8_temp_stdDev = l8.map(iv).reduce(ee.Reducer.stdDev()).select(23);


//print(l8.map(iv), "l8 map iv");

//print(l8_ndvi_mean, "l8 ndvi mean");
//print(l8_ndvi_min, "l8 ndvi min");
//print(l8_ndvi_stdDev, "l8 ndvi stdDev");

/////////////////////////////////////////////////////////////////////
var s1 = s1
    .filterDate(data_inicial, data_final)
    //filtro por região
    //.filterBounds(roi)
    .filterMetadata('transmitterReceiverPolarisation','equals', ["VV","VH"]);


//print('sentinel 1', s1)
//print('sentinel 1 stack', s1.toBands())

// função para cálculo da razão
var vv_hh = function(img){
  return img.addBands(ee.Image(img.select('VV').divide(img.select('VH'))).select([0],['VV_VH']));
};


//Calcula NDVI e Reduz conforme especificado
var s1_ndvi_mean = s1.map(vv_hh).reduce(ee.Reducer.mean()).select(3);
var s1_ndvi_min = s1.map(vv_hh).reduce(ee.Reducer.min()).select(3);
var s1_ndvi_stdDev = s1.map(vv_hh).reduce(ee.Reducer.stdDev()).select(3);

//print(s1_ndvi_mean, 's1 ndvi mean');
//print(s1_ndvi_min, 's1 ndvi min');
//print(s1_ndvi_stdDev, 's1 ndvi stdDev');


//Map.addLayer(s1_ndvi_mean.clip(roi), {min: -25, max: 0}, 'mean value S1', false);
//Map.addLayer(s2_ndvi_mean.clip(roi), {min: 160, max: 1049}, 'mean value S2', false);
//Map.addLayer(l8_ndvi_mean.clip(roi), {min: 264, max: 1187}, 'mean value L8', false);


var featureSpace = s1_ndvi_mean.addBands([s1_ndvi_min, s1_ndvi_stdDev, 
s2_ndvi_mean, s2_ndvi_min, s2_ndvi_stdDev, l8_ndvi_mean, l8_ndvi_min, l8_ndvi_stdDev,
s2_qtb_mean, s2_qtb_min, s2_qtb_stdDev, s2_qtg_mean, s2_qtg_min, s2_qtg_stdDev, 
s2_qtr_mean, s2_qtr_min, s2_qtr_stdDev,l8_qtb_mean, l8_qtb_min, l8_qtb_stdDev,
l8_qtr_mean, l8_qtr_min ,l8_qtr_stdDev,l8_qtg_mean, l8_qtg_min, l8_qtg_stdDev, 
dem_mean, dem_min, dem_stdDev]);

print(featureSpace, "feature space");

var amostras = pontos;

var amostras_treinamento = featureSpace.sampleRegions(amostras,['Classe'],10,null,16).randomColumn();

//print(amostras_treinamento, 'mostras');

var validation = amostras_treinamento.filter(ee.Filter.lt("random", 0.3));
//print(validation, 'validation');

amostras_treinamento = amostras_treinamento.filter(ee.Filter.gt("random", 0.7));
//print(amostras_treinamento, 'treinamento');

var nArvores = 30;

var classificador = ee.Classifier.smileRandomForest(nArvores);

classificador = classificador.train(amostras_treinamento, 'Classe', featureSpace.bandNames());

var classificacao = featureSpace.classify(classificador).clip(roi);

print(classificacao, "resultado classificacao");

var accuracy = validation.classify(classificador)
    .errorMatrix("Classe", "classification").accuracy();
    
print(accuracy, "acerto");

Map.addLayer(classificacao.toByte(),
{min:1,max:5,palette:['#083ce2','#6ac221','#fff317','#ff1bde','#9b3513']},'Classificação');

Map.addLayer(table, {color: 'red'}, 'turfeirasref');
Map.addLayer(pontos, {color: 'red'}, 'Pontos',false);



// azul-agua, verde-vegnativa, amarelo-pastagem, rosa-agricultura, marrom-silvicultura

//exporta imagem classificacao
Export.image.toDrive({
  image: classificacao, 
  description: "Classificacao", 
  folder: "TCC", 
  region: roi,
  scale: 20,
  maxPixels: 1e13,
  //crs,
  //crsTransform, 
  }
);


print(classificacao, 'raster classificado');


var poligono = classificacao.reduceToVectors({
  geometry: roi, 
  scale: 20, 
  geometryType: 'polygon',
  eightConnected: false, 
  labelProperty: 'classification', 
  bestEffort: true, 
  maxPixels: 1e13, 
  tileScale: 16,
});
 
//print(poligono, 'poligono');

//Map.addLayer(poligono, {}, 'Poligono')
//Map.addLayer(pontos, {}, 'Pontos')


Export.table.toDrive({
  collection: poligono, 
  description:'Vector_classificado', 
  folder: 'TCC', 
  fileFormat: "SHP", 
  //selectors: 'classification'
});

var areaImage = ee.Image.pixelArea().addBands(classificacao);

// Converter para hectares
var image_hectares = areaImage.multiply(0.0001);

var areas = image_hectares.reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'Classe',
    }),
  geometry: roi.geometry(),
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1e10
}); 
 

print(areas, 'areas');