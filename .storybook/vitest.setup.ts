import { beforeAll } from 'vitest'
import { setProjectAnnotations } from '@storybook/react'
// NOTE: jest-dom/vitest matchers are loaded via vitest.config.ts globalSetup
// Do NOT import here - breaks Chromatic builds (customEqualityTesters error)

import * as previewAnnotations from './preview'

const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)
