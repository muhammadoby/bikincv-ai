const BaseMessage = <T>(success: boolean, message: string, data?: T | null) => {
  return {
    success,
    message,
    data
  }
}

export default BaseMessage
