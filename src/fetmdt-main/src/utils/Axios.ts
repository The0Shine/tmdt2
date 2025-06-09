/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
    // AxiosError,
    AxiosInstance,
} from 'axios'
// import axiosRetry from "axios-retry";
import nProgress from 'nprogress'
import { toast } from 'sonner'

export class Repository {
    private axiosInstance: AxiosInstance
    private isRefreshing = false
    private failedQueue: Array<{
        resolve: (value?: any) => void
        reject: (reason?: any) => void
    }> = []
    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach((promise) => {
            if (error) {
                promise.reject(error)
            } else {
                promise.resolve(token)
            }
        })
        this.failedQueue = []
    }

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
        })

        // axiosRetry(this.axiosInstance, {
        //   retries: 3,
        //   retryDelay: (retryCount: number): number => {
        //     return retryCount * 3000; // 1 second * retryCount
        //   },
        //   retryCondition: (error: AxiosError): boolean => {
        //     const err = (
        //       error?.response?.data as {
        //         errors?: [
        //           {
        //             title: string;
        //             detail: string;
        //             code: number;
        //           },
        //         ];
        //       }
        //     )?.errors?.[0];

        //     return err?.code === 401;
        //   },
        // });

        // Add a request interceptor
        this.axiosInstance.interceptors.request.use(
            function (config) {
                const at = localStorage.getItem('access_token') ?? ''
                config.headers['Authorization'] = 'Bearer ' + at
                return config
            },
            function (error) {
                return Promise.reject(error)
            },
        )

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config
                console.log(error.response.status)
                console.log(originalRequest)

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject })
                        })
                            .then((token) => {
                                originalRequest.headers['Authorization'] =
                                    'Bearer ' + token
                                return this.axiosInstance(originalRequest)
                            })
                            .catch(Promise.reject)
                    }

                    originalRequest._retry = true
                    this.isRefreshing = true

                    try {
                        const refreshToken =
                            localStorage.getItem('refresh_token')
                        const response = await axios.post(
                            `${import.meta.env.VITE_BASE_URL}/api/users/refresh`,
                            { token: refreshToken },
                            {
                                headers: {
                                    'x-api-key': import.meta.env.VITE_API_KEY,
                                },
                            },
                        )

                        const newAccessToken = response.data.data.accessToken
                        const newRefreshToken = response.data.data.refreshToken
                        localStorage.setItem('access_token', newAccessToken)
                        localStorage.setItem('refresh_token', newRefreshToken)

                        this.processQueue(null, newAccessToken)
                        originalRequest.headers['Authorization'] =
                            'Bearer ' + newAccessToken

                        return this.axiosInstance(originalRequest)
                    } catch (err) {
                        this.processQueue(err, null)
                        toast.error(
                            'Token expired or your account is currently logged in from another location!',
                        )
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        localStorage.removeItem('isAuthenticated')
                        localStorage.removeItem('user')
                        window.location.href = '/login'
                        return Promise.reject(err)
                    } finally {
                        this.isRefreshing = false
                    }
                }

                return Promise.reject(error)
            },
        )
    }
    // Add a response interceptor

    public async get<T = any>(url: string, notShowMessenger?: boolean) {
        nProgress.start()
        try {
            const res = await this.axiosInstance.get<T>(url)
            return res.data
        } catch (error: any) {
            if (!notShowMessenger) {
                await this.HanderResponse(error)
            }
            //  return null;
        } finally {
            nProgress.done()
        }
    }

    public async post<T = any>(url: string, data?: any) {
        nProgress.start()

        try {
            const res = await this.axiosInstance.post<T>(url, data)
            return res.data
        } catch (error: any) {
            await this.HanderResponse(error)
            //   return null;
        } finally {
            nProgress.done()
        }
    }

    public async put<T>(url: string, data?: any) {
        nProgress.start()

        try {
            const res = await this.axiosInstance.put<T>(url, data)
            return res.data
        } catch (error: any) {
            await this.HanderResponse(error)
        } finally {
            nProgress.done()
        }
    }

    public async patch<T>(url: string, data?: any) {
        nProgress.start()

        try {
            const res = await this.axiosInstance.patch<T>(url, data)
            return res.data
        } catch (error: any) {
            await this.HanderResponse(error)
        } finally {
            nProgress.done()
        }
    }

    public async delete<T>(url: string) {
        nProgress.start()

        try {
            const res = await this.axiosInstance.delete<T>(url)
            return res.data
        } catch (error: any) {
            await this.HanderResponse(error)
        } finally {
            nProgress.done()
        }
    }

    private async HanderResponse(err: any) {
        // do something

        const myErr = (
            err?.response?.data as {
                errors?: [
                    {
                        title: string
                        detail: string
                        code: number
                    },
                ]
            }
        )?.errors?.[0]

        if (err.status !== 401) {
            console.log(err)

            toast.error(myErr?.detail ?? 'Unexpected error!')
        }
    }
}

export default Repository
