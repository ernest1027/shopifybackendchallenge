//Middleware to handle responses
const responseHandler = (responseData, request , response, next) => {
    //Handle error response
    if (responseData.code >=400 ) {
        const responseJSON = {
            status: 0,
            errors: responseData.errors,
            data: responseData.data
        }
        console.log(responseJSON);
        response.status(responseData.code).json(responseJSON)
    }

    //Handle successful response
    else {
        const responseJSON = {
            status: 1,
            data: responseData.data
        }
        console.log(responseJSON);
        response.status(responseData.code).json(responseJSON)
    }
}

module.exports = {responseHandler}