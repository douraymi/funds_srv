(function(window, angular, undefined) {'use strict';

var urlBase = "/zapiz";
var authHeader = 'authorization';

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.User
 * @header lbServices.User
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `User` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "User",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/users/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.User#login
         * @methodOf lbServices.User
         *
         * @description
         *
         * Login a user with username/email and password
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         * 
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         * 
         *
         */
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/users/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#logout
         * @methodOf lbServices.User
         *
         * @description
         *
         * Logout a user with access token
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/users/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#confirm
         * @methodOf lbServices.User
         *
         * @description
         *
         * Confirm a user registration with email verification token
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` - 
         *
         *  - `token` – `{string}` - 
         *
         *  - `redirect` – `{string}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/users/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#resetPassword
         * @methodOf lbServices.User
         *
         * @description
         *
         * Reset password for a user with email
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/users/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__findById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find a related item by id for accessTokens
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__findById__accessTokens": {
          url: urlBase + "/users/:id/accessTokens/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__destroyById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a related item by id for accessTokens
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__accessTokens": {
          url: urlBase + "/users/:id/accessTokens/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__updateById__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update a related item by id for accessTokens
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__updateById__accessTokens": {
          url: urlBase + "/users/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use User.sumi() instead.
        "prototype$__get__sumi": {
          url: urlBase + "/users/:id/sumi",
          method: "GET"
        },

        // INTERNAL. Use User.stocks.findById() instead.
        "prototype$__findById__stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "GET"
        },

        // INTERNAL. Use User.stocks.destroyById() instead.
        "prototype$__destroyById__stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use User.stocks.updateById() instead.
        "prototype$__updateById__stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__get__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Queries accessTokens of user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/users/:id/accessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__create__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$__create__accessTokens": {
          url: urlBase + "/users/:id/accessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__delete__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__accessTokens": {
          url: urlBase + "/users/:id/accessTokens",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$__count__accessTokens
         * @methodOf lbServices.User
         *
         * @description
         *
         * Counts accessTokens of user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "prototype$__count__accessTokens": {
          url: urlBase + "/users/:id/accessTokens/count",
          method: "GET"
        },

        // INTERNAL. Use User.stocks() instead.
        "prototype$__get__stocks": {
          isArray: true,
          url: urlBase + "/users/:id/stocks",
          method: "GET"
        },

        // INTERNAL. Use User.stocks.create() instead.
        "prototype$__create__stocks": {
          url: urlBase + "/users/:id/stocks",
          method: "POST"
        },

        // INTERNAL. Use User.stocks.destroyAll() instead.
        "prototype$__delete__stocks": {
          url: urlBase + "/users/:id/stocks",
          method: "DELETE"
        },

        // INTERNAL. Use User.stocks.count() instead.
        "prototype$__count__stocks": {
          url: urlBase + "/users/:id/stocks/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#create
         * @methodOf lbServices.User
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/users",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#upsert
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/users",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#exists
         * @methodOf lbServices.User
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/users/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/users/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#find
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/users",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#findOne
         * @methodOf lbServices.User
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/users/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#updateAll
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/users/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#deleteById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/users/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#count
         * @methodOf lbServices.User
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/users/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#prototype$updateAttributes
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/users/:id",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.user() instead.
        "::get::sumi::user": {
          url: urlBase + "/sumis/:id/user",
          method: "GET"
        },

        // INTERNAL. Use Stock.user() instead.
        "::get::stock::user": {
          url: urlBase + "/stocks/:id/user",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/users" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.User#updateOrCreate
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.User#update
         * @methodOf lbServices.User
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.User#destroyById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#removeById
         * @methodOf lbServices.User
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.User#getCachedCurrent
         * @methodOf lbServices.User
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.User#login} or
         * {@link lbServices.User#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A User instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#isAuthenticated
         * @methodOf lbServices.User
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.User#getCurrentId
         * @methodOf lbServices.User
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name lbServices.User#modelName
    * @propertyOf lbServices.User
    * @description
    * The name of the model represented by this $resource,
    * i.e. `User`.
    */
    R.modelName = "User";


        /**
         * @ngdoc method
         * @name lbServices.User#sumi
         * @methodOf lbServices.User
         *
         * @description
         *
         * Fetches hasOne relation sumi
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        R.sumi = function() {
          var TargetResource = $injector.get("Sumi");
          var action = TargetResource["::get::user::sumi"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.User.stocks
     * @header lbServices.User.stocks
     * @object
     * @description
     *
     * The object `User.stocks` groups methods
     * manipulating `Stock` instances related to `User`.
     *
     * Call {@link lbServices.User#stocks User.stocks()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.User#stocks
         * @methodOf lbServices.User
         *
         * @description
         *
         * Queries stocks of user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R.stocks = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::get::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#count
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Counts stocks of user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.stocks.count = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::count::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#create
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Creates a new instance in stocks of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R.stocks.create = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::create::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#destroyAll
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Deletes all stocks of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.stocks.destroyAll = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::delete::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#destroyById
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Delete a related item by id for stocks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for stocks
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.stocks.destroyById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::destroyById::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#findById
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Find a related item by id for stocks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for stocks
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R.stocks.findById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::findById::user::stocks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.User.stocks#updateById
         * @methodOf lbServices.User.stocks
         *
         * @description
         *
         * Update a related item by id for stocks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for stocks
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R.stocks.updateById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::updateById::user::stocks"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Sumi
 * @header lbServices.Sumi
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Sumi` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Sumi",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/sumis/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Sumi.user() instead.
        "prototype$__get__user": {
          url: urlBase + "/sumis/:id/user",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.findById() instead.
        "prototype$__findById__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.destroyById() instead.
        "prototype$__destroyById__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.updateById() instead.
        "prototype$__updateById__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiHistorys.findById() instead.
        "prototype$__findById__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiHistorys.destroyById() instead.
        "prototype$__destroyById__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiHistorys.updateById() instead.
        "prototype$__updateById__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs() instead.
        "prototype$__get__sumiFakeBJs": {
          isArray: true,
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.create() instead.
        "prototype$__create__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "POST"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.destroyAll() instead.
        "prototype$__delete__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.count() instead.
        "prototype$__count__sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/count",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiHistorys() instead.
        "prototype$__get__sumiHistorys": {
          isArray: true,
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiHistorys.create() instead.
        "prototype$__create__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "POST"
        },

        // INTERNAL. Use Sumi.sumiHistorys.destroyAll() instead.
        "prototype$__delete__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiHistorys.count() instead.
        "prototype$__count__sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#create
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/sumis",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#upsert
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/sumis",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#exists
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/sumis/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#findById
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/sumis/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#find
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/sumis",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#findOne
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/sumis/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#updateAll
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/sumis/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#deleteById
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/sumis/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#count
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/sumis/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#prototype$updateAttributes
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/sumis/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#set
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `data` – `{object=}` - 
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `status` – `{string=}` - 
         */
        "set": {
          url: urlBase + "/sumis/set",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#sync
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `status` – `{string=}` - 
         */
        "sync": {
          url: urlBase + "/sumis/sync",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#reset
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `status` – `{string=}` - 
         */
        "reset": {
          url: urlBase + "/sumis/reset",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#rework
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `status` – `{string=}` - 
         */
        "rework": {
          url: urlBase + "/sumis/rework",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#getFBJ
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `parm` – `{object=}` - 
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `sumiFBJs` – `{object=}` - 
         *
         *  - `fakeBJSet` – `{array=}` - 
         */
        "getFBJ": {
          url: urlBase + "/sumis/getFBJ",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Sumi#des
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `ok` – `{string=}` - 
         */
        "des": {
          url: urlBase + "/sumis/des",
          method: "GET"
        },

        // INTERNAL. Use User.sumi() instead.
        "::get::user::sumi": {
          url: urlBase + "/users/:id/sumi",
          method: "GET"
        },

        // INTERNAL. Use SumiFakeBJ.sumi() instead.
        "::get::sumiFakeBJ::sumi": {
          url: urlBase + "/sumiFakeBJs/:id/sumi",
          method: "GET"
        },

        // INTERNAL. Use SumiHistory.sumi() instead.
        "::get::sumiHistory::sumi": {
          url: urlBase + "/sumiHistories/:id/sumi",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Sumi#updateOrCreate
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Sumi#update
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Sumi#destroyById
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Sumi#removeById
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Sumi#modelName
    * @propertyOf lbServices.Sumi
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Sumi`.
    */
    R.modelName = "Sumi";


        /**
         * @ngdoc method
         * @name lbServices.Sumi#user
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Fetches belongsTo relation user
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R.user = function() {
          var TargetResource = $injector.get("User");
          var action = TargetResource["::get::sumi::user"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Sumi.sumiFakeBJs
     * @header lbServices.Sumi.sumiFakeBJs
     * @object
     * @description
     *
     * The object `Sumi.sumiFakeBJs` groups methods
     * manipulating `SumiFakeBJ` instances related to `Sumi`.
     *
     * Call {@link lbServices.Sumi#sumiFakeBJs Sumi.sumiFakeBJs()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Sumi#sumiFakeBJs
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Queries sumiFakeBJs of sumi.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        R.sumiFakeBJs = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::get::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#count
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Counts sumiFakeBJs of sumi.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.sumiFakeBJs.count = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::count::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#create
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Creates a new instance in sumiFakeBJs of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        R.sumiFakeBJs.create = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::create::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#destroyAll
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Deletes all sumiFakeBJs of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.sumiFakeBJs.destroyAll = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::delete::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#destroyById
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Delete a related item by id for sumiFakeBJs
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiFakeBJs
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.sumiFakeBJs.destroyById = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::destroyById::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#findById
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Find a related item by id for sumiFakeBJs
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiFakeBJs
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        R.sumiFakeBJs.findById = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::findById::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiFakeBJs#updateById
         * @methodOf lbServices.Sumi.sumiFakeBJs
         *
         * @description
         *
         * Update a related item by id for sumiFakeBJs
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiFakeBJs
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        R.sumiFakeBJs.updateById = function() {
          var TargetResource = $injector.get("SumiFakeBJ");
          var action = TargetResource["::updateById::sumi::sumiFakeBJs"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Sumi.sumiHistorys
     * @header lbServices.Sumi.sumiHistorys
     * @object
     * @description
     *
     * The object `Sumi.sumiHistorys` groups methods
     * manipulating `SumiHistory` instances related to `Sumi`.
     *
     * Call {@link lbServices.Sumi#sumiHistorys Sumi.sumiHistorys()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Sumi#sumiHistorys
         * @methodOf lbServices.Sumi
         *
         * @description
         *
         * Queries sumiHistorys of sumi.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        R.sumiHistorys = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::get::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#count
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Counts sumiHistorys of sumi.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.sumiHistorys.count = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::count::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#create
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Creates a new instance in sumiHistorys of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        R.sumiHistorys.create = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::create::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#destroyAll
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Deletes all sumiHistorys of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.sumiHistorys.destroyAll = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::delete::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#destroyById
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Delete a related item by id for sumiHistorys
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiHistorys
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.sumiHistorys.destroyById = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::destroyById::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#findById
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Find a related item by id for sumiHistorys
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiHistorys
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        R.sumiHistorys.findById = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::findById::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Sumi.sumiHistorys#updateById
         * @methodOf lbServices.Sumi.sumiHistorys
         *
         * @description
         *
         * Update a related item by id for sumiHistorys
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for sumiHistorys
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        R.sumiHistorys.updateById = function() {
          var TargetResource = $injector.get("SumiHistory");
          var action = TargetResource["::updateById::sumi::sumiHistorys"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.SumiFakeBJ
 * @header lbServices.SumiFakeBJ
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `SumiFakeBJ` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "SumiFakeBJ",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/sumiFakeBJs/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use SumiFakeBJ.sumi() instead.
        "prototype$__get__sumi": {
          url: urlBase + "/sumiFakeBJs/:id/sumi",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#create
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/sumiFakeBJs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#upsert
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/sumiFakeBJs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#exists
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/sumiFakeBJs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#findById
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/sumiFakeBJs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#find
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/sumiFakeBJs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#findOne
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/sumiFakeBJs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#updateAll
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/sumiFakeBJs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#deleteById
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/sumiFakeBJs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#count
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/sumiFakeBJs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#prototype$updateAttributes
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/sumiFakeBJs/:id",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.findById() instead.
        "::findById::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.destroyById() instead.
        "::destroyById::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.updateById() instead.
        "::updateById::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs() instead.
        "::get::sumi::sumiFakeBJs": {
          isArray: true,
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.create() instead.
        "::create::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "POST"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.destroyAll() instead.
        "::delete::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiFakeBJs.count() instead.
        "::count::sumi::sumiFakeBJs": {
          url: urlBase + "/sumis/:id/sumiFakeBJs/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#updateOrCreate
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiFakeBJ` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#update
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#destroyById
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#removeById
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.SumiFakeBJ#modelName
    * @propertyOf lbServices.SumiFakeBJ
    * @description
    * The name of the model represented by this $resource,
    * i.e. `SumiFakeBJ`.
    */
    R.modelName = "SumiFakeBJ";


        /**
         * @ngdoc method
         * @name lbServices.SumiFakeBJ#sumi
         * @methodOf lbServices.SumiFakeBJ
         *
         * @description
         *
         * Fetches belongsTo relation sumi
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        R.sumi = function() {
          var TargetResource = $injector.get("Sumi");
          var action = TargetResource["::get::sumiFakeBJ::sumi"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.SumiHistory
 * @header lbServices.SumiHistory
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `SumiHistory` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "SumiHistory",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/sumiHistories/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use SumiHistory.sumi() instead.
        "prototype$__get__sumi": {
          url: urlBase + "/sumiHistories/:id/sumi",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#create
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/sumiHistories",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#upsert
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/sumiHistories",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#exists
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/sumiHistories/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#findById
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/sumiHistories/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#find
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/sumiHistories",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#findOne
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/sumiHistories/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#updateAll
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/sumiHistories/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#deleteById
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/sumiHistories/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#count
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/sumiHistories/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#prototype$updateAttributes
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/sumiHistories/:id",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiHistorys.findById() instead.
        "::findById::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiHistorys.destroyById() instead.
        "::destroyById::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiHistorys.updateById() instead.
        "::updateById::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Sumi.sumiHistorys() instead.
        "::get::sumi::sumiHistorys": {
          isArray: true,
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "GET"
        },

        // INTERNAL. Use Sumi.sumiHistorys.create() instead.
        "::create::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "POST"
        },

        // INTERNAL. Use Sumi.sumiHistorys.destroyAll() instead.
        "::delete::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys",
          method: "DELETE"
        },

        // INTERNAL. Use Sumi.sumiHistorys.count() instead.
        "::count::sumi::sumiHistorys": {
          url: urlBase + "/sumis/:id/sumiHistorys/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#updateOrCreate
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `SumiHistory` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#update
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#destroyById
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#removeById
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.SumiHistory#modelName
    * @propertyOf lbServices.SumiHistory
    * @description
    * The name of the model represented by this $resource,
    * i.e. `SumiHistory`.
    */
    R.modelName = "SumiHistory";


        /**
         * @ngdoc method
         * @name lbServices.SumiHistory#sumi
         * @methodOf lbServices.SumiHistory
         *
         * @description
         *
         * Fetches belongsTo relation sumi
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Sumi` object.)
         * </em>
         */
        R.sumi = function() {
          var TargetResource = $injector.get("Sumi");
          var action = TargetResource["::get::sumiHistory::sumi"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Stock
 * @header lbServices.Stock
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Stock` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Stock",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/stocks/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Stock.user() instead.
        "prototype$__get__user": {
          url: urlBase + "/stocks/:id/user",
          method: "GET"
        },

        // INTERNAL. Use Stock.stockTracks.findById() instead.
        "prototype$__findById__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "GET"
        },

        // INTERNAL. Use Stock.stockTracks.destroyById() instead.
        "prototype$__destroyById__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Stock.stockTracks.updateById() instead.
        "prototype$__updateById__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Stock.stockTracks() instead.
        "prototype$__get__stockTracks": {
          isArray: true,
          url: urlBase + "/stocks/:id/stockTracks",
          method: "GET"
        },

        // INTERNAL. Use Stock.stockTracks.create() instead.
        "prototype$__create__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks",
          method: "POST"
        },

        // INTERNAL. Use Stock.stockTracks.destroyAll() instead.
        "prototype$__delete__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks",
          method: "DELETE"
        },

        // INTERNAL. Use Stock.stockTracks.count() instead.
        "prototype$__count__stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#create
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/stocks",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#upsert
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/stocks",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#exists
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/stocks/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#findById
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/stocks/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#find
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/stocks",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#findOne
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/stocks/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#updateAll
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/stocks/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#deleteById
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/stocks/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#count
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/stocks/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#prototype$updateAttributes
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/stocks/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Stock#getList
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `parm` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{array=}` - 
         *
         *  - `recordsFiltered` – `{number=}` - 
         *
         *  - `recordsTotal` – `{number=}` - 
         */
        "getList": {
          url: urlBase + "/stocks/getList",
          method: "POST"
        },

        // INTERNAL. Use User.stocks.findById() instead.
        "::findById::user::stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "GET"
        },

        // INTERNAL. Use User.stocks.destroyById() instead.
        "::destroyById::user::stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use User.stocks.updateById() instead.
        "::updateById::user::stocks": {
          url: urlBase + "/users/:id/stocks/:fk",
          method: "PUT"
        },

        // INTERNAL. Use User.stocks() instead.
        "::get::user::stocks": {
          isArray: true,
          url: urlBase + "/users/:id/stocks",
          method: "GET"
        },

        // INTERNAL. Use User.stocks.create() instead.
        "::create::user::stocks": {
          url: urlBase + "/users/:id/stocks",
          method: "POST"
        },

        // INTERNAL. Use User.stocks.destroyAll() instead.
        "::delete::user::stocks": {
          url: urlBase + "/users/:id/stocks",
          method: "DELETE"
        },

        // INTERNAL. Use User.stocks.count() instead.
        "::count::user::stocks": {
          url: urlBase + "/users/:id/stocks/count",
          method: "GET"
        },

        // INTERNAL. Use StockTrack.stock() instead.
        "::get::stockTrack::stock": {
          url: urlBase + "/stockTracks/:id/stock",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Stock#updateOrCreate
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Stock#update
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Stock#destroyById
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Stock#removeById
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Stock#modelName
    * @propertyOf lbServices.Stock
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Stock`.
    */
    R.modelName = "Stock";


        /**
         * @ngdoc method
         * @name lbServices.Stock#user
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Fetches belongsTo relation user
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `User` object.)
         * </em>
         */
        R.user = function() {
          var TargetResource = $injector.get("User");
          var action = TargetResource["::get::stock::user"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Stock.stockTracks
     * @header lbServices.Stock.stockTracks
     * @object
     * @description
     *
     * The object `Stock.stockTracks` groups methods
     * manipulating `StockTrack` instances related to `Stock`.
     *
     * Call {@link lbServices.Stock#stockTracks Stock.stockTracks()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Stock#stockTracks
         * @methodOf lbServices.Stock
         *
         * @description
         *
         * Queries stockTracks of stock.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        R.stockTracks = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::get::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#count
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Counts stockTracks of stock.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.stockTracks.count = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::count::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#create
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Creates a new instance in stockTracks of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        R.stockTracks.create = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::create::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#destroyAll
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Deletes all stockTracks of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.stockTracks.destroyAll = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::delete::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#destroyById
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Delete a related item by id for stockTracks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for stockTracks
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.stockTracks.destroyById = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::destroyById::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#findById
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Find a related item by id for stockTracks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for stockTracks
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        R.stockTracks.findById = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::findById::stock::stockTracks"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Stock.stockTracks#updateById
         * @methodOf lbServices.Stock.stockTracks
         *
         * @description
         *
         * Update a related item by id for stockTracks
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for stockTracks
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        R.stockTracks.updateById = function() {
          var TargetResource = $injector.get("StockTrack");
          var action = TargetResource["::updateById::stock::stockTracks"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.StockTrack
 * @header lbServices.StockTrack
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `StockTrack` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "StockTrack",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/stockTracks/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use StockTrack.stock() instead.
        "prototype$__get__stock": {
          url: urlBase + "/stockTracks/:id/stock",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#create
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/stockTracks",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#upsert
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/stockTracks",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#exists
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/stockTracks/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#findById
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/stockTracks/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#find
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/stockTracks",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#findOne
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/stockTracks/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#updateAll
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "updateAll": {
          url: urlBase + "/stockTracks/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#deleteById
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "deleteById": {
          url: urlBase + "/stockTracks/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#count
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/stockTracks/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#prototype$updateAttributes
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/stockTracks/:id",
          method: "PUT"
        },

        // INTERNAL. Use Stock.stockTracks.findById() instead.
        "::findById::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "GET"
        },

        // INTERNAL. Use Stock.stockTracks.destroyById() instead.
        "::destroyById::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Stock.stockTracks.updateById() instead.
        "::updateById::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Stock.stockTracks() instead.
        "::get::stock::stockTracks": {
          isArray: true,
          url: urlBase + "/stocks/:id/stockTracks",
          method: "GET"
        },

        // INTERNAL. Use Stock.stockTracks.create() instead.
        "::create::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks",
          method: "POST"
        },

        // INTERNAL. Use Stock.stockTracks.destroyAll() instead.
        "::delete::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks",
          method: "DELETE"
        },

        // INTERNAL. Use Stock.stockTracks.count() instead.
        "::count::stock::stockTracks": {
          url: urlBase + "/stocks/:id/stockTracks/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.StockTrack#updateOrCreate
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `StockTrack` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#update
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Update instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#destroyById
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.StockTrack#removeById
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.StockTrack#modelName
    * @propertyOf lbServices.StockTrack
    * @description
    * The name of the model represented by this $resource,
    * i.e. `StockTrack`.
    */
    R.modelName = "StockTrack";


        /**
         * @ngdoc method
         * @name lbServices.StockTrack#stock
         * @methodOf lbServices.StockTrack
         *
         * @description
         *
         * Fetches belongsTo relation stock
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Stock` object.)
         * </em>
         */
        R.stock = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::get::stockTrack::stock"];
          return action.apply(R, arguments);
        };

    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out non urlBase requests
          if (config.url.substr(0, urlBase.length) !== urlBase) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
