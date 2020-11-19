enum HttpStatusCode {
    // Informational
    PROCESSING = 102,

    // Success
    OK = 200,
    CREATED = 201, // Return a location for the new resource
    ACCEPTED = 202, // Return a location for the pending resource
    
    // Redirection

    // Client Errors
    FORBIDDEN = 403,
    NOT_FOUND = 404,

    // Server Errors
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,

    // Unofficial codes

}

export default HttpStatusCode;