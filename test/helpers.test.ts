import { describe, test, expect } from 'bun:test';
import { parseRepo, formatDate, groupByCategory } from '../src/utils/helpers';
import type { Project } from '../src/types';

describe('Helpers', () => {
  describe('parseRepo', () => {
    test('should parse owner/repo format', () => {
      const result = parseRepo('vercel/next.js');
      expect(result).toEqual({ owner: 'vercel', name: 'next.js' });
    });

    test('should parse github:owner/repo format', () => {
      const result = parseRepo('github:vercel/next.js');
      expect(result).toEqual({ owner: 'vercel', name: 'next.js' });
    });

    test('should return null for invalid format', () => {
      expect(parseRepo('invalid')).toBeNull();
      expect(parseRepo('too/many/slashes')).toBeNull();
    });
  });

  describe('formatDate', () => {
    test('should return YYYY-MM-DD format', () => {
      const date = formatDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('groupByCategory', () => {
    test('should group projects by category', () => {
      const projects: Project[] = [
        {
          name: 'next.js',
          repo: 'vercel/next.js',
          category: 'frontend',
          commit: 'abc',
          branch: 'main',
          added: '2026-02-23'
        },
        {
          name: 'fastify',
          repo: 'fastify/fastify',
          category: 'backend',
          commit: 'def',
          branch: 'main',
          added: '2026-02-23'
        },
        {
          name: 'react',
          repo: 'facebook/react',
          category: 'frontend',
          commit: 'ghi',
          branch: 'main',
          added: '2026-02-23'
        }
      ];

      const grouped = groupByCategory(projects);

      expect(grouped.frontend).toHaveLength(2);
      expect(grouped.backend).toHaveLength(1);
      expect(grouped.frontend[0].name).toBe('next.js');
      expect(grouped.backend[0].name).toBe('fastify');
    });

    test('should handle empty array', () => {
      const grouped = groupByCategory([]);
      expect(Object.keys(grouped)).toHaveLength(0);
    });
  });
});
