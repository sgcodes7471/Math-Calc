export const COLORS = [
    "#ee3333",
    "#e64980",
    "#be4bdb",
    "#228be6",
    "#3333ee",
    "#40c057",
    "#00aa00",
    "#fab005",
    "#fd7e14",
    "#fff"
]

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export interface MathExpressionCase{
    expr: string; 
    result: number | string;
    assign?: boolean; 
};
  
type VariableDictionary = Record<string, number>;

export const fnPrompt = (dictOfVars: VariableDictionary): string => `
  You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them.
  Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction.
  
  For example:
  Q. 2 + 3 * 4 
  (3 * 4) => 12, 2 + 12 = 14.
  Q. 2 + 3 + 5 * 4 - 8 / 2 
  5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21.
  
  YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME:
  Following are the cases:
  1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE OBJECT [{ "expr": given expression, "result": calculated answer }].
  
  2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for the given variable, and the format should be a COMMA SEPARATED LIST OF OBJECTS, with object 1 as { "expr": "x", "result": 2, "assign": true } and object 2 as { "expr": "y", "result": 5, "assign": true }. This example assumes x was calculated as 2, and y as 5. Include as many objects as there are variables.
  
  3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the object called { "assign": true }, keeping the variable as "expr" and the value as "result" in the original object. RETURN AS A LIST OF OBJECTS.
  
  4. Analyzing Graphical Math problems, which are word problems represented in drawing form, such as cars colliding, trigonometric problems, problems on the Pythagorean theorem, adding runs from a cricket wagon wheel, etc. These will have a drawing representing some scenario and accompanying information with the image. PAY CLOSE ATTENTION TO DIFFERENT COLORS FOR THESE PROBLEMS. You need to return the answer in the format of a LIST OF ONE OBJECT [{ "expr": given expression, "result": calculated answer }].
  
  5. Detecting Abstract Concepts that a drawing might show, such as love, hate, jealousy, patriotism, or a historic reference to war, invention, discovery, quote, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE ANSWER, where "expr" will be the explanation of the drawing, and "result" will be the abstract concept.
  
  Analyze the equation or expression in this image and return the answer according to the given rules:
  Make sure to use extra backslashes for escape characters like \\f -> \\\\f, \\n -> \\\\n, etc.
  
  Here is a dictionary of user-assigned variables. If the given expression has any of these variables, use its actual value from this dictionary accordingly: ${JSON.stringify(dictOfVars)}.
  DO NOT USE BACKTICKS OR MARKDOWN FORMATTING.
  PROPERLY QUOTE THE KEYS AND VALUES IN THE OBJECT FOR EASIER PARSING WITH JSON.parse.
  `;