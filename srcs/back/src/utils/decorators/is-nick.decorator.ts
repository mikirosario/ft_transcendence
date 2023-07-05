import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNick(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isNick',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
				const nickRegex = /^[a-zA-Z0-9-_]+$/; // Regular expression for nickname validation
				if (typeof value !== 'string' || !nickRegex.test(value)) {
					return false;
				}
				return true;
				},
				defaultMessage(args: ValidationArguments) {
				return `${args.property} must be a valid nickname consisting of letters, numbers, hyphens, and underscores.`;
				},
			},
		});
	};
}
