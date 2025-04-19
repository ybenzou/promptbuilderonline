import json

def handler(event, context):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',   # 👈 关键，加上这个
        },
        'body': '{"message": "Hello from PromptBuilder Lambda!"}'
    }

