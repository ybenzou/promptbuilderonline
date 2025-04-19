import json
import boto3

# 连接 DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TemplateTable-dev')

def handler(event, context):
    params = event.get('queryStringParameters') or {}
    tag = params.get('tag')
    style = params.get('style')
    lang = params.get('lang')

    if not tag or not style or not lang:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing tag/style/lang'})
        }

    style_lang = f"{style}_{lang}"

    try:
        # 先查特定项
        response = table.get_item(Key={
            'tag': tag,
            'style_lang': style_lang
        })
        item = response.get('Item')

        if item:
            # 查到，正常返回
            result = {
                'system': item.get('system', '')
            }
            if 'userPrefix' in item:
                result['userPrefix'] = item['userPrefix']
        else:
            # 没查到，返回全表
            scan_response = table.scan()
            items = scan_response.get('Items', [])
            # 简单返回所有item
            result = items

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
