// import axios from 'axios';
// import { v4 as uuid } from 'uuid';

// class DspaceClient {
//     #serverBaseUrl;

//     constructor() {
//         this.#serverBaseUrl = "https://4a5d-2401-4900-8817-1afb-dc03-c204-fc13-c316.ngrok-free.app";
//     }

//     async upload(files, baseRemotePath) {
//         try {
//             const prefix = 'root';
//             if (!baseRemotePath.startsWith(prefix)) {
//                 baseRemotePath = prefix + baseRemotePath;
//             }

//             for (const file of files) {
//                 if (file.type) {
//                     const fileRemotePath = baseRemotePath+"\\"+file.webkitRelativePath.replace(/\//g, '\\');
//                     console.log(fileRemotePath);
//                     await this.uploadFile(file, fileRemotePath);
//                 } else {
//                     console.error("Invalid file type", file);
//                 }
//             }
//         } catch (error) {
//             this.#logError("error in upload()",error);
//         }
//     }

//     async uploadFile(file, remotePath) {
//         try {
//             const form = new FormData();
            
//             const directoryStructure = {
//                 id: uuid(),
//                 name: file.name,
//                 type: "file",
//                 path: remotePath,
//                 size: file.size,
//             };

//             form.append("directoryStructure", JSON.stringify(directoryStructure));
//             form.append("files", file);

//             const url = `${this.#serverBaseUrl}/upload`;
            
//             let start = performance.now()
//             const response = await axios.post(url, form);
//             let end = performance.now()
//             console.log("Time taken (ms):", end - start);

//             // Calculate throughput in Mbps
//             let throughput = (file.size * 8) / ((end - start) / 1000) / 1_000_000;
//             console.log("Calculated throughput (Mbps):", throughput);

//             if (!response) {
//                 throw new Error("Failed to reach server");
//             }

//             return response.data;
//         } catch (error) {
//             this.#logError("error in uploadFile()",error);
//         }
//     }

//     async retrieve(identifier) {
//         try {
//             const url = `${this.#serverBaseUrl}/retrieve/${identifier}`;
            
//             let start = performance.now()
//             const response = await fetch(url, { method: 'GET' });
//             const contentLength = parseInt(response.headers.get('content-length'));
//             let end = performance.now()
//             console.log("Time taken (ms):", end - start);

//             // Calculate throughput in Mbps
//             let throughput = (contentLength * 8) / ((end - start) / 1000) / 1_000_000;
//             console.log("Calculated throughput (Mbps):", throughput);
    
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
    
//             const contentDisposition = response.headers.get('content-disposition');
//             let filename = "default";
//             if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
//                 const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
//                 if (matches != null && matches[1]) {
//                     filename = matches[1].replace(/['"]/g, '');
//                 }
//             }
    
//             const blob = await response.blob();
//             const link = document.createElement('a');
//             link.href = window.URL.createObjectURL(blob);
//             link.download = filename;
    
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(link.href);
    
//             console.log("Resource retrieved successfully");
//         } catch (error) {
//             this.#logError("Error in retrieve()", error);
//         }
//     }


//     async delete(identifier) {
//         try {
//             const url = `${this.#serverBaseUrl}/delete/${identifier}`;
//             await axios.delete(url);
//         } catch (error) {
//             this.#logError(error, "delete");
//         }
//     }

//     async getUserDirectory() {
//         try {
//             const url = `${this.#serverBaseUrl}/directory`;
//             const response = await axios.get(url, {
//                 headers: {
//                     "ngrok-skip-browser-warning": "true",
//                 },
//             });
//             return response.data;
//         } catch (error) {
//             this.#logError(error, "getUserDirectory");
//         }
//     }
    

//     #logError(error, functionName) {
//         const formattedError = `
//             Message: Error in ${functionName}()
//             Error Name: ${error.name || 'N/A'}
//             Error Message: ${error.message || 'N/A'}
//             Stack Trace: ${error.stack || 'N/A'}
//             Complete Error: ${error}
//         `;
//         console.error(formattedError);
//     }
// }

// const dspaceClient = new DspaceClient();
// export default dspaceClient;

import axios from 'axios';
import { v4 as uuid } from 'uuid';

class DspaceClient {
    #serverBaseUrl;

    constructor() {
        this.#serverBaseUrl = "https://e961-2401-4900-8817-1afb-f8ae-9db6-1a3a-a469.ngrok-free.app";

        // Set default Axios headers globally
        axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
    }

    async upload(files, baseRemotePath) {
        try {
            const prefix = 'root';
            if (!baseRemotePath.startsWith(prefix)) {
                baseRemotePath = prefix + baseRemotePath;
            }

            for (const file of files) {
                if (file.type) {
                    const fileRemotePath = baseRemotePath + "\\" + file.webkitRelativePath.replace(/\//g, '\\');
                    console.log(fileRemotePath);
                    await this.uploadFile(file, fileRemotePath);
                } else {
                    console.error("Invalid file type", file);
                }
            }
        } catch (error) {
            this.#logError("error in upload()", error);
        }
    }

    async uploadFile(file, remotePath) {
        try {
            const form = new FormData();

            const directoryStructure = {
                id: uuid(),
                name: file.name,
                type: "file",
                path: remotePath,
                size: file.size,
            };

            form.append("directoryStructure", JSON.stringify(directoryStructure));
            form.append("files", file);

            const url = `${this.#serverBaseUrl}/upload`;

            let start = performance.now();
            const response = await axios.post(url, form);
            let end = performance.now();
            console.log("Time taken (ms):", end - start);

            // Calculate throughput in Mbps
            let throughput = (file.size * 8) / ((end - start) / 1000) / 1_000_000;
            console.log("Calculated throughput (Mbps):", throughput);

            if (!response) {
                throw new Error("Failed to reach server");
            }

            return response.data;
        } catch (error) {
            this.#logError("error in uploadFile()", error);
        }
    }

    async retrieve(identifier) {
        try {
            const url = `${this.#serverBaseUrl}/retrieve/${identifier}`;

            let start = performance.now();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const contentLength = parseInt(response.headers.get('content-length'));
            let end = performance.now();
            console.log("Time taken (ms):", end - start);

            // Calculate throughput in Mbps
            let throughput = (contentLength * 8) / ((end - start) / 1000) / 1_000_000;
            console.log("Calculated throughput (Mbps):", throughput);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentDisposition = response.headers.get('content-disposition');
            let filename = "default";
            if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);

            console.log("Resource retrieved successfully");
        } catch (error) {
            this.#logError("Error in retrieve()", error);
        }
    }

    async delete(identifier) {
        try {
            const url = `${this.#serverBaseUrl}/delete/${identifier}`;
            await axios.delete(url);
        } catch (error) {
            this.#logError(error, "delete");
        }
    }

    async getUserDirectory() {
        try {
            const url = `${this.#serverBaseUrl}/directory`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            this.#logError(error, "getUserDirectory");
        }
    }

    #logError(error, functionName) {
        const formattedError = `
            Message: Error in ${functionName}()
            Error Name: ${error.name || 'N/A'}
            Error Message: ${error.message || 'N/A'}
            Stack Trace: ${error.stack || 'N/A'}
            Complete Error: ${error}
        `;
        console.error(formattedError);
    }
}

const dspaceClient = new DspaceClient();
export default dspaceClient;
