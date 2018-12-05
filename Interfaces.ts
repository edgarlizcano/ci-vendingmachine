export interface callback {
    (any:string|null,data?:any):void
}
export interface mux {
    valueMux1: boolean,
    valueMux2: boolean
}
export interface EventFormat {
    cmd: string,
    data: string
}