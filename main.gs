function onFormSubmit(e) {
  var values = e.namedValues;
  
  var factoryAddress = "46 Euston Road, Alexandria, NSW, Australia";
  var siteAddress = values['Street Address'] + ", " + values['Suburb'] + ", " + values['State'] + ", " + values['Country'];

  var nearestCity = NEARESTURBANCENTRE(siteAddress,"name");
  var siteToCity = GOOGLEMAPS(siteAddress, nearestCity, "kilometers");
  var factoryToSite = GOOGLEMAPS(factoryAddress, siteAddress, "kilometers");
  
  var dealNumber = newDeal(values['Project Name'], values['Company Name'], values['Your name'], values['E-mail']);
  var pipedriveLink = "https://5b.pipedrive.com/deal/" + dealNumber;
  var projectID = createProjectID(dealNumber);
  var dropboxPath = createDropboxFolder(stringClean(values['Company Name'].toString()), projectID, stringClean(values['Project Name'].toString()));
  var dropboxLink = getDropboxLink(dropboxPath);
  
  var fileName = projectID + ' - ' + stringClean(values['Project Name'].toString()) + ' - Pricing';
  
  var ss = SpreadsheetApp.openById("1V3B6Tjab0h9IaCtut0zFLKAhplHgxIGAc7mFG5lC25A");
  
  var newSS = fillInSpreadsheet(ss.copy(fileName), values, projectID, nearestCity, siteToCity, factoryToSite, pipedriveLink, dropboxLink);
  var emailAddresses = ["rob.ludwick@5b.com.au", "francesca.osborne@5b.com.au"]
  newSS.addEditors(emailAddresses)
  var spreadsheetLink = newSS.getUrl();
  
  var blob = getExcelDoc(newSS);
  var excelFileLink = uploadToDropbox(blob, dropboxPath);
  var helioscopeProjectId = newHelioscopeProject(projectID + ' - ' + values['Company Name'] + ' - ' + values['Project Name'], values['Company Name'], 
                                            dropboxLink, values['DC Power Target (kW)'], siteAddress);
  var helioscopeDesignId = newHelioscopeDesign(helioscopeProjectId);
  var numMavs = getNumMAVs(values['DC Power Target (kW)'], 340, 9, 5);
  var newSegment = newFieldSegment(helioscopeDesignId, numMavs, 34.28, 6);
  var helioscopeLink = "https://www.helioscope.com/projects/" + helioscopeProjectId;
  
  
  var alertSubject = projectID + "- New MAV Quote For " + values['Your name'] + " from " + values['Company Name'];
  var ndaVars = getNDAVars(values['Company Name'], values['Company ACN'], values['Company Address'], values['Your name'], values['E-mail'], getLongDate());
  var nda = createNDA("1q4aBiQrTsVrAhMMex3VCJ0-FpD0nMbp8bHNtI5o6TvA", ndaVars)
  var blob = getWordDoc(nda);
  uploadToDropbox(blob, dropboxPath, true)
  
  sendEmail("rob.ludwick@5b.com.au", alertSubject, newSS, blob, dropboxLink, pipedriveLink, helioscopeLink, spreadsheetLink);
  sendSlackAlert(alertSubject, newSS, dropboxLink, pipedriveLink, helioscopeLink, spreadsheetLink);
  createTrelloCard(projectID, values['Company Name'], values['Project Name'], values['Your name'], pipedriveLink, dropboxLink, spreadsheetLink);
}