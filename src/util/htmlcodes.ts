enum HttpStatusCode {
    
    OK = 200,

    CREATED = 201, // Return a location for the new resource
    ACCEPTED = 202, // Return a location for the pending resource
    
    FORBIDDEN = 403,
    NOT_FOUND = 404,

    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,

}

export default HttpStatusCode;