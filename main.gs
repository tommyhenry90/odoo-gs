/**
 * Authenticates User and return user id.
 *
 * @param {string} dbName the name of the database we are connecting to 
 * @param {string} url the url of the odoo database
 * @param {string} username of user
 * @param {string} password of user
 * @param {int}    optional port number of database - ignore is using online
 *
 * @return {int} user ID of user loggin in to be used in rest of calls
 */
function authenticateOdoo(dbName, url, username, password, opt_port) {
  // assume port 80 (http) if not specified by user
  if (opt_port == null) {
    opt_port = 80;
  }
  
  // Connect to odoo common end point for authentication
  var common = url + ":" + opt_port + "/xmlrpc/2/common";
  var request = new XMLRPC.XmlRpcRequest(odoo.URL_COMMON, "authenticate");
  
  // add required elements to authentication call
  request.addParam(dbName); 
  request.addParam(username);
  request.addParam(password);
  request.addParam({});
  
  // Get user id for future calls and return
  var userId = request.send().parseXML();
  return userId
}

/**
 * create data in odoo specified odoo objet.
 *
 * @param {string} dbName the name of the database we are connecting to 
 * @param {string} userId of user
 * @param {string} password of user
 * @param {string} odooObject - the name of the object in odoo eg res.partner
 * @param {string} data row of information to be created
 * @param {string} url the url of the odoo database
 * @param {int}    optional port number of database - ignore is using online
 *
 * @return {string} result of create request from odoo
 */
function create(dbName, userId, password, odooObject, data, url, opt_port) {
  
  var URL_OBJECT = url + ":" + opt_port + "/xmlrpc/2/object";
  
  var request = new XMLRPC.XmlRpcRequest(odoo.URL_OBJECT, "execute_kw");
  
  request.addParam(dbName);
  request.addParam(userId);
  request.addParam(password);
  
  request.addParam(odooObject);
  request.addParam("create");
  request.addParam(data);
  
  var response = request.send().parseXML();
  return response
}