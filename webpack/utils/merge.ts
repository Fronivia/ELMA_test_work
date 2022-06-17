import { Configuration } from 'webpack';

export function merge<T>(commonConfig: T, mergeConfig: Configuration): T {
	return { ...commonConfig, ...mergeConfig };
}
