NDWI GeoTIFF Export

This repository contains a Google Earth Engine (GEE) script that computes the **Normalized Difference Water Index (NDWI)** from Sentinel-2 Surface Reflectance imagery for a rectangular region, and exports the result as a GeoTIFF to Google Drive.

---

Key Parameters
| Parameter | Default | Description |
|------------|----------|--------------|
| `YEAR` | `2019` | Year to map |
| `AOI` | `[-93.60, 29.60, -93.05, 30.00]` | Rectangle [minLon, minLat, maxLon, maxLat] |
| `MONTHS` | `[6,7,8,9]` | Months for NDWI calculation (June–September) |
| `CLOUDY_SCENE_PCT` | `60` | Maximum cloud percentage |
| `EXPORT_SCALE` | `10` | Pixel resolution (m) |
| `EXPORT_CRS` | `EPSG:32615` | Coordinate system (UTM Zone 15N for Louisiana) |
| `DRIVE_FOLDER` | `GEE_NDWI` | Google Drive folder for export |

---

How to Run (Google Earth Engine)
1. Go to [https://code.earthengine.google.com](https://code.earthengine.google.com)  
2. Create a new script and paste the contents of [`ndwi_cameron_beach_export.js`](ndwi_cameron_beach_export.js)  
3. Modify the variables marked EDIT (YEAR, AOI, etc.)  
4. Click **Run** to visualize the NDWI layer  
5. In the *Tasks* panel, click **Run** on the **Export** task to save the GeoTIFF to Google Drive  

---

Notes
- Use `EPSG:4326` if you prefer WGS84 global projection  
- Adjust `CLOUDY_SCENE_PCT` for coverage/clarity trade-off  
- Extend `MONTHS` for full-year NDWI or specific seasons  

---

References
- **Dataset:** Sentinel-2 Surface Reflectance (`COPERNICUS/S2_SR`) via Google Earth Engine  
- **Algorithm:** McFeeters, S.K. (1996). *The use of the Normalized Difference Water Index (NDWI) in the delineation of open water features.*

---

Author
**Md Ali Ahnaf Abid Mayukh**  
Department of Civil & Environmental Engineering  
Islamic University of Technology (IUT) - OIC, Bangladesh  

---

License
Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
