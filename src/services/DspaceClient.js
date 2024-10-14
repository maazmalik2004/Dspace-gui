import axios from 'axios';
import { v4 as uuid } from 'uuid';

class DspaceClient {
    #serverBaseUrl;

    constructor() {
        this.#serverBaseUrl = "http://localhost:5000";
    }

    async upload(files, baseRemotePath) {
        try {
            const prefix = 'root';
            if (!baseRemotePath.startsWith(prefix)) {
                baseRemotePath = prefix + baseRemotePath;
            }

            for (const file of files) {
                if (file.type) {
                    const fileRemotePath = baseRemotePath+"\\"+file.webkitRelativePath.replace(/\//g, '\\');
                    console.log(fileRemotePath);
                    await this.uploadFile(file, fileRemotePath);
                } else {
                    console.error("Invalid file type", file);
                }
            }
        } catch (error) {
            this.#logError("error in upload()",error);
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
            const response = await axios.post(url, form);

            if (!response) {
                throw new Error("Failed to reach server");
            }

            return response.data;
        } catch (error) {
            this.#logError("error in uploadFile()",error);
        }
    }

    async retrieve(identifier) {
        try {
            const url = `${this.#serverBaseUrl}/retrieve/${identifier}`;
            const response = await fetch(url, { method: 'GET' });
    
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
