import React, { useEffect, useState } from 'react'

const useRandomNum = () => {
  const random =Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
  return random
}

export default useRandomNum