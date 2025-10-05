// === NDWI GeoTIFF for a rectangular area around Cameron Beach, Louisiana ===
// Change the few lines marked "EDIT".

// -------------------- EDIT: YEAR & AOI RECTANGLE --------------------
var YEAR = 2019; // <--- EDIT: year to map (e.g., 2019–2025)

// Rectangle around Cameron Beach (lon/lat): left, bottom, right, top
// Cameron town ≈ (-93.325, 29.797). Make this bigger/smaller as you like.
var AOI = ee.Geometry.Rectangle(
  [-93.60, 29.60,  -93.05, 30.00],  // <--- EDIT: your rectangle
  null, false
);

// -------------------- (Usually OK defaults) -------------------------
var MONTHS = [6,7,8,9];        // <--- EDIT if needed (Jun–Sep)
var CLOUDY_SCENE_PCT = 60;     // relaxed to ensure coverage
var EXPORT_SCALE = 10;         // 10 m for Sentinel-2
var EXPORT_CRS = 'EPSG:32615'; // UTM 15N (covers ~93°W); change if you prefer
var DRIVE_FOLDER = 'GEE_NDWI'; // <--- EDIT: your Drive folder name

// -------------------- Build date range ------------------------------
var start = ee.Date.fromYMD(YEAR, MONTHS[0], 1);
var end   = ee.Date.fromYMD(YEAR, MONTHS[MONTHS.length - 1], 1).advance(1, 'month');

// -------------------- Simple cloud masking (S2 SR, SCL-based) ------
function maskS2_SCL(img){
  var scl = img.select('SCL');
  // Remove: 0/1 No data/Sat., 3 Shadow, 8/9 Clouds, 10 Cirrus
  var good = scl.neq(0).and(scl.neq(1)).and(scl.neq(3))
                 .and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return img.updateMask(good);
}

// -------------------- Load Sentinel-2 SR and compute NDWI -----------
var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(AOI)
  .filterDate(start, end)
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUDY_SCENE_PCT))
  .map(maskS2_SCL)
  .map(function(img){
    var ndwi = img.normalizedDifference(['B3','B8']).rename('NDWI'); // (Green-NIR)/(Green+NIR)
    return ndwi.copyProperties(img, img.propertyNames());
  });

var ndwiMed = s2.median().clip(AOI);

// Quick sanity prints (optional)
print('S2 scenes used:', s2.size());
print('NDWI median image:', ndwiMed);

// -------------------- Visualize in the Code Editor (optional) -------
Map.centerObject(AOI, 11);
Map.addLayer(ndwiMed, {min:-0.5, max:0.8, palette:['ffffff','d1e5f0','92c5de','4393c3','2166ac','053061']}, 'NDWI (median)');

// -------------------- EXPORT GeoTIFF to Drive ----------------
Export.image.toDrive({
  image: ndwiMed,
  description: 'NDWI_CameronBeach_' + YEAR,
  folder: DRIVE_FOLDER,
  fileNamePrefix: 'NDWI_CameronBeach_' + YEAR,
  region: AOI,
  scale: EXPORT_SCALE,     // 10 m
  crs: EXPORT_CRS,         // set to null to keep native proj
  maxPixels: 1e13
});

/*
NOTES:
- YEAR: pick the year you want.
- AOI: use rectangle ; expand/contract as needed.
- MONTHS: choose season ([1..12] for full year).
- CLOUDY_SCENE_PCT: increase if you get too few images, decrease for cleaner composites.
- EXPORT_*: change Drive folder/name, scale (10 m S2), CRS (e.g., EPSG:4326 if you want WGS84).
*/


