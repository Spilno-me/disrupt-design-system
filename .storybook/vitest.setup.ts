import { beforeAll } from 'vitest'
import { setProjectAnnotations } from '@storybook/react'
import '@testing-library/jest-dom/vitest'

import * as previewAnnotations from './preview'

const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)
