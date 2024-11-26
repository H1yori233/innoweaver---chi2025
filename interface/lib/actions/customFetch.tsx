function handleUnauthorizedError() {
    localStorage.removeItem("token");

    alert("Your session has expired. Please log in again.");
    window.location.href = '/user/login';
}


export async function customFetch(url, options = {}) {
    const apiUrl = process.env.API_URL;
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }), 
        // ...options.headers,
    };

    console.log(`${apiUrl}${url}`);
    const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        handleUnauthorizedError();
        throw new Error('Unauthorized: Token has expired or is invalid.');
    }

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorDetails)}`);
    }

    return response.json();
}
