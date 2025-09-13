export const handleError = (error: any): string => {
    if (error?.response?.data) {
        const errorData = error.response.data;
        
        if (Array.isArray(errorData.detail)) {
            return errorData.detail.map((err: any) => 
                err.msg || err.message || 'Validation error'
            ).join(', ');
        }
        
        if (typeof errorData.detail === 'string') {
            return errorData.detail;
        }
        
        if (errorData.message) {
            return errorData.message;
        }
    }
    
    return error?.message || 'An error occurred';
};